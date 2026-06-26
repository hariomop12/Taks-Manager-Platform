import { Router } from 'express';
import { getAll, create, getById, update, updateStatus, remove } from '../controllers/task.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import validate from '../middleware/validation.middleware.js';
import { createTaskSchema, updateTaskSchema, updateStatusSchema } from '../validations/task.validation.js';

const router = Router();

router.use(authenticate);
router.get('/', getAll);
router.post('/', authorize('admin'), validate(createTaskSchema), create);
router.get('/:id', getById);
router.put('/:id', authorize('admin'), validate(updateTaskSchema), update);
router.patch('/:id/status', validate(updateStatusSchema), updateStatus);
router.delete('/:id', authorize('admin'), remove);

export default router;
