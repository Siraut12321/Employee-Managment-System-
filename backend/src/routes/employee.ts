import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  getEmployees, getEmployee, createEmployee, updateEmployee,
  deleteEmployee, bulkDelete, uploadProfileImage
} from '../controllers/employeeController';
import { protect, authorize } from '../middleware/auth';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

const router = Router();

router.use(protect);

router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', authorize('super_admin', 'hr_manager'), createEmployee);
router.put('/:id', authorize('super_admin', 'hr_manager'), updateEmployee);
router.delete('/bulk', authorize('super_admin', 'hr_manager'), bulkDelete);
router.delete('/:id', authorize('super_admin', 'hr_manager'), deleteEmployee);
router.post('/:id/upload', authorize('super_admin', 'hr_manager'), upload.single('image'), uploadProfileImage);

export default router;
