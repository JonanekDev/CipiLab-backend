import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { HashingService } from '../auth/hashing.service';
import { User, UserRole, UserSession } from 'generated/prisma';
import { ChangePasswordReqDto } from './dto/changepassword.req.dto';
import { UpdateProfileReqDto } from './dto/update-profile.req.dto';

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

  async changePassword(userId: number,  dto: ChangePasswordReqDto): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isCurrentPasswordValid = await this.hashingService.compare(
      dto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }
    const hashedPassword = await this.hashingService.hash(dto.password);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async updateProfile(userId: number, dto: UpdateProfileReqDto): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: dto.username,
        email: dto.email,
      },
    })
  }

  async getActiveSessions(userId: number): Promise<UserSession[]> {
    const sessions = await this.prisma.userSession.findMany({
      where: { userId, revoked: false, expiresAt: { gt: new Date() } },
    });
    return sessions;
  }

}
