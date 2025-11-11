import * as Joi from 'joi';

export const validationSchema = Joi.object({
  API_PORT: Joi.number().default(3000),
  AUTH_SALT_ROUNDS: Joi.number().default(12),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().default('5m'),

  REFRESH_EXPIRES_DAYS: Joi.number().default(7),
  REFRESH_IDLE_EXPIRES_DAYS: Joi.number().default(30),
  REFRESH_TMP_EXPIRES_HOURS: Joi.number().default(6),
  REFRESH_TMP_IDLE_EXPIRES_MINUTES: Joi.number().default(12),

  COOKIE_SECRET: Joi.string().required(),
});
