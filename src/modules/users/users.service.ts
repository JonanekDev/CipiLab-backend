import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { HashingService } from '../auth/hashing.service';
import { User, UserRole, UserSession } from 'generated/prisma';
import { ChangePasswordReqDto } from './dto/changepassword.req.dto';
import { UpdateProfileReqDto } from './dto/update-profile.req.dto';
import {
  InvalidPasswordException,
  UserNotFoundException,
} from 'src/common/exceptions/user.exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

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
    this.logger.log(
      `Creating user with email: ${email}, username: ${username}, role: ${role}`,
    );
    const user = this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role,
      },
    });
    return user;
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

  async changePassword(
    userId: number,
    dto: ChangePasswordReqDto,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new InvalidPasswordException();
    }
    const hashedPassword = await this.hashingService.hash(dto.password);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    this.logger.log(
      `Changed password for user ${user.username} with ID: ${userId}`,
    );
  }

  async updateProfile(userId: number, dto: UpdateProfileReqDto): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: dto.username,
        email: dto.email,
      },
    });
    this.logger.log(`Updating profile for user with ID: ${userId}`);
  }

  async getActiveSessions(userId: number): Promise<UserSession[]> {
    const sessions = await this.prisma.userSession.findMany({
      where: { userId, revoked: false, expiresAt: { gt: new Date() } },
    });
    return sessions;
  }
}
