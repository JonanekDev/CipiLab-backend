import { Injectable } from '@nestjs/common';
import e from 'express';
import { PrismaService } from 'src/database/prisma.service';
import { PasswordService } from '../auth/password.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async createUser(email: string, username: string, password: string) {
    const hashedPassword = await this.passwordService.hashPassword(password);
    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
  }

  async existsAtLeastOne(): Promise<boolean> {
    const count = await this.prisma.user.count();
    return count > 0;
  }
}
