import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { HashingService } from '../auth/hashing.service';
import { User, UserRole } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingService,
  ) {}

  async createUser(
    username: string,
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Promise<User> {
    const hashedPassword = await this.hashingService.hash(password);
    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role,
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

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
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

  async changePassword(userId: number, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashingService.hash(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
