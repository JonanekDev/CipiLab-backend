import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.API_PORT ?? '3000', 10),
  auth: {
    salt_rounds: parseInt(process.env.AUTH_SALT_ROUNDS ?? '12', 10), //15 too much, 12 is good enough? Maybe?
    jwt: {
      secret: process.env.AUTH_JWT_SECRET ?? 'default_secret', // TODO: Random generation on first run
      expiresIn: process.env.AUTH_JWT_EXPIRIES_IN ?? '60s',
    },
    refreshToken_expiresIn_days: parseInt(
      process.env.AUTH_REFRESH_TOKEN_EXPIRIES_IN_DAYS ?? '7',
      10,
    ),
  },
}));
