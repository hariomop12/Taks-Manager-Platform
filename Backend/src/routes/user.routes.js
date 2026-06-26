import { Router } from 'express';
import { getAll, getById, update, remove } from '../controllers/user.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import validate from '../middleware/validation.middleware.js';
import { updateUserSchema } from '../validations/user.validation.js';

const router = Router();

router.use(authenticate);
router.get('/', authorize('admin'), getAll);
router.get('/:id', getById);
router.put('/:id', validate(updateUserSchema), update);
router.delete('/:id', authorize('admin'), remove);

export default router;
