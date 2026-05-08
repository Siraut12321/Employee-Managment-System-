import { Response } from 'express';
import Employee from '../models/Employee';
import { AuthRequest } from '../middleware/auth';

const generateEmployeeId = async (): Promise<string> => {
  const count = await Employee.countDocuments();
  return `EMP${String(count + 1).padStart(4, '0')}`;
};

export const getEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  const { search, department, status, page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (department) filter.departmentId = department;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate('departmentId', 'name')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Employee.countDocuments(filter),
  ]);

  res.json({ employees, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
};

export const getEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  const employee = await Employee.findById(req.params.id).populate('departmentId', 'name description');
  if (!employee) { res.status(404).json({ message: 'Employee not found' }); return; }
  res.json(employee);
};

export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  const employeeId = await generateEmployeeId();
  const employee = await Employee.create({ ...req.body, employeeId });
  res.status(201).json(employee);
};

export const updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('departmentId', 'name');
  if (!employee) { res.status(404).json({ message: 'Employee not found' }); return; }
  res.json(employee);
};

export const deleteEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) { res.status(404).json({ message: 'Employee not found' }); return; }
  res.json({ message: 'Employee deleted' });
};

export const bulkDelete = async (req: AuthRequest, res: Response): Promise<void> => {
  const { ids } = req.body;
  await Employee.deleteMany({ _id: { $in: ids } });
  res.json({ message: `${ids.length} employees deleted` });
};

export const uploadProfileImage = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.file) { res.status(400).json({ message: 'No file uploaded' }); return; }
  const imageUrl = `/uploads/${req.file.filename}`;
  const employee = await Employee.findByIdAndUpdate(req.params.id, { profileImage: imageUrl }, { new: true });
  if (!employee) { res.status(404).json({ message: 'Employee not found' }); return; }
  res.json({ profileImage: imageUrl });
};
