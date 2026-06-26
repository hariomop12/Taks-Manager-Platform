import ApiError from '../utils/ApiError.js';

export default function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      return next(new ApiError(422, messages));
    }
    req.body = value;
    next();
  };
}
