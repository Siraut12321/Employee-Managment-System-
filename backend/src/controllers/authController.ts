import { Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  const admin = await Admin.findOne({ email });
  if (!admin || !admin.isActive) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const admin = await Admin.findById(req.admin?.id).select('-password');
  res.json(admin);
};

export const createAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;
  
  const exists = await Admin.findOne({ email });
  if (exists) {
    res.status(400).json({ message: 'Admin already exists' });
    return;
  }

  const admin = await Admin.create({ name, email, password, role });
  res.status(201).json({
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role
  });
};
