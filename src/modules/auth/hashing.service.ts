import { Inject, Injectable } from '@nestjs/common';
import * as config from '@nestjs/config';
import bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';

@Injectable()
export class HashingService {
  constructor(
    @Inject(configuration.KEY)
    private readonly appConfig: config.ConfigType<typeof configuration>,
  ) {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.appConfig.auth.saltRounds);
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}
