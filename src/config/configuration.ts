import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.API_PORT ?? '3000', 10),
  password: {
    salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '20', 10),
  },
}));
