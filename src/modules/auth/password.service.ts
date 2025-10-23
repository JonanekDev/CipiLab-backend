import { Inject, Injectable } from '@nestjs/common';
import * as config from '@nestjs/config';
import bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';

@Injectable()
export class PasswordService {
  constructor(
    @Inject(configuration.KEY)
    private readonly appConfig: config.ConfigType<typeof configuration>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.appConfig.auth.salt_rounds);
  }

  async comparePasswords(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}
