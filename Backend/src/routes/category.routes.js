import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/category.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import validate from '../middleware/validation.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation.js';

const router = Router();

router.use(authenticate);
router.get('/', getAll);
router.post('/', authorize('admin'), validate(createCategorySchema), create);
router.put('/:id', authorize('admin'), validate(updateCategorySchema), update);
router.delete('/:id', authorize('admin'), remove);

export default router;
