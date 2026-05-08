import { Router } from 'express';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../controllers/departmentController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getDepartments);
router.post('/', authorize('super_admin', 'hr_manager'), createDepartment);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateDepartment);
router.delete('/:id', authorize('super_admin'), deleteDepartment);

export default router;
