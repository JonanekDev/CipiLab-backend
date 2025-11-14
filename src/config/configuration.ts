import { registerAs } from '@nestjs/config';

// Default are handled in validation schema
export default registerAs('app', () => ({
  port: parseInt(process.env.API_PORT!, 10),
  auth: {
    saltRounds: parseInt(process.env.AUTH_SALT_ROUNDS!, 10),
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresIn: process.env.JWT_EXPIRES!,
    },
    refreshToken: {
      expiresInDays: parseInt(process.env.REFRESH_EXPIRES_DAYS!, 10),
      idleExpiresInDays: parseInt(process.env.REFRESH_IDLE_EXPIRES_DAYS!, 10),
      tempExpiresInHours: parseInt(process.env.REFRESH_TMP_EXPIRES_HOURS!, 10),
      tempIdleExpiresInMinutes: parseInt(
        process.env.REFRESH_TMP_IDLE_EXPIRES_MINUTES!,
        10,
      ),
    },
    cookie: {
      secret: process.env.COOKIE_SECRET!,
    },
  },
}));
