import { Response } from 'express';
import Department from '../models/Department';
import Employee from '../models/Employee';
import { AuthRequest } from '../middleware/auth';

export const getDepartments = async (req: AuthRequest, res: Response): Promise<void> => {
  const departments = await Department.find({ isActive: true })
    .populate('managerId', 'name email position')
    .sort({ name: 1 });

  const withCount = await Promise.all(
    departments.map(async (dept) => {
      const count = await Employee.countDocuments({ departmentId: dept._id, status: 'active' });
      return { ...dept.toObject(), employeeCount: count };
    })
  );

  res.json(withCount);
};

export const createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, description, managerId } = req.body;
  const dept = await Department.create({ name, description, managerId });
  res.status(201).json(dept);
};

export const updateDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!dept) { res.status(404).json({ message: 'Department not found' }); return; }
  res.json(dept);
};

export const deleteDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  const count = await Employee.countDocuments({ departmentId: req.params.id });
  if (count > 0) {
    res.status(400).json({ message: 'Cannot delete department with active employees' });
    return;
  }
  await Department.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Department deleted' });
};
