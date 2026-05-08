import { Response } from 'express';
import Salary from '../models/Salary';
import Employee from '../models/Employee';
import Department from '../models/Department';
import { AuthRequest } from '../middleware/auth';

export const getSalaries = async (req: AuthRequest, res: Response): Promise<void> => {
  const { month, year, status, employeeId, page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const filter: Record<string, unknown> = {};
  if (month) filter.month = parseInt(month as string);
  if (year) filter.year = parseInt(year as string);
  if (status) filter.status = status;
  if (employeeId) filter.employeeId = employeeId;

  const [salaries, total] = await Promise.all([
    Salary.find(filter)
      .populate('employeeId', 'name employeeId position')
      .sort({ year: -1, month: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Salary.countDocuments(filter),
  ]);

  res.json({ salaries, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
};

export const createSalary = async (req: AuthRequest, res: Response): Promise<void> => {
  const { employeeId, month, year, baseSalary, bonus = 0, deductions = 0, notes } = req.body;

  const exists = await Salary.findOne({ employeeId, month, year });
  if (exists) {
    res.status(400).json({ message: 'Salary record already exists for this month' });
    return;
  }

  const netSalary = baseSalary + bonus - deductions;
  const salary = await Salary.create({ employeeId, month, year, baseSalary, bonus, deductions, netSalary, notes });
  res.status(201).json(salary);
};

export const updateSalary = async (req: AuthRequest, res: Response): Promise<void> => {
  const { baseSalary, bonus, deductions } = req.body;
  if (baseSalary !== undefined || bonus !== undefined || deductions !== undefined) {
    const current = await Salary.findById(req.params.id);
    if (!current) { res.status(404).json({ message: 'Salary record not found' }); return; }
    const b = baseSalary ?? current.baseSalary;
    const bo = bonus ?? current.bonus;
    const d = deductions ?? current.deductions;
    req.body.netSalary = b + bo - d;
  }
  const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!salary) { res.status(404).json({ message: 'Salary record not found' }); return; }
  res.json(salary);
};

export const markAsPaid = async (req: AuthRequest, res: Response): Promise<void> => {
  const salary = await Salary.findByIdAndUpdate(
    req.params.id,
    { status: 'paid', paidDate: new Date() },
    { new: true }
  );
  if (!salary) { res.status(404).json({ message: 'Salary record not found' }); return; }
  res.json(salary);
};

export const getSalaryAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  const { year = new Date().getFullYear() } = req.query;

  const monthly = await Salary.aggregate([
    { $match: { year: parseInt(year as string) } },
    {
      $group: {
        _id: '$month',
        totalPayroll: { $sum: '$netSalary' },
        totalBonus: { $sum: '$bonus' },
        totalDeductions: { $sum: '$deductions' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(monthly);
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const [
    totalEmployees,
    activeEmployees,
    totalDepts,
    currentPayroll,
    lastPayroll,
  ] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'active' }),
    Department.countDocuments({ isActive: true }),
    Salary.aggregate([
      { $match: { month: currentMonth, year: currentYear } },
      { $group: { _id: null, total: { $sum: '$netSalary' } } },
    ]),
    Salary.aggregate([
      { $match: { month: lastMonth, year: lastYear } },
      { $group: { _id: null, total: { $sum: '$netSalary' } } },
    ]),
  ]);

  const currentTotal = currentPayroll[0]?.total || 0;
  const lastTotal = lastPayroll[0]?.total || 0;
  const growth = lastTotal > 0 ? (((currentTotal - lastTotal) / lastTotal) * 100).toFixed(1) : '0';

  res.json({
    totalEmployees,
    activeEmployees,
    totalDepartments: totalDepts,
    monthlyPayroll: currentTotal,
    payrollGrowth: growth,
  });
};
