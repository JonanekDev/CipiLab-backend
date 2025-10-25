import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PasswordService } from '../auth/password.service';
import { User } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async createUser(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await this.passwordService.hashPassword(password);
    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async existsAtLeastOne(): Promise<boolean> {
    const count = await this.prisma.user.count();
    return count > 0;
  }
}
