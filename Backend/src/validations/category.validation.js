import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  color: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/).allow('', null),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  color: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/).allow('', null),
}).min(1);
