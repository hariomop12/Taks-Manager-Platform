import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().allow('', null),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled'),
  due_date: Joi.date().iso().allow(null),
  assigned_to: Joi.number().integer().positive().allow(null),
  category_ids: Joi.array().items(Joi.number().integer().positive()),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().allow('', null),
  priority: Joi.string().valid('low', 'medium', 'high', 'critical'),
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled'),
  due_date: Joi.date().iso().allow(null),
  assigned_to: Joi.number().integer().positive().allow(null),
  category_ids: Joi.array().items(Joi.number().integer().positive()),
}).min(1);

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').required(),
});
