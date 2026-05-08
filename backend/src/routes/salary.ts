import { Router } from 'express';
import {
  getSalaries, createSalary, updateSalary, markAsPaid,
  getSalaryAnalytics, getDashboardStats
} from '../controllers/salaryController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getSalaries);
router.get('/analytics', getSalaryAnalytics);
router.get('/dashboard-stats', getDashboardStats);
router.post('/', authorize('super_admin', 'hr_manager', 'accountant'), createSalary);
router.put('/:id', authorize('super_admin', 'hr_manager', 'accountant'), updateSalary);
router.patch('/:id/pay', authorize('super_admin', 'accountant'), markAsPaid);

export default router;
