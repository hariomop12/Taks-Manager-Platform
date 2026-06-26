import Joi from 'joi';

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().trim().email(),
  password: Joi.string().min(6).max(128),
  profile_image: Joi.string().uri().allow('', null),
  role: Joi.string().valid('admin', 'user'),
  is_active: Joi.number().valid(0, 1),
}).min(1);
