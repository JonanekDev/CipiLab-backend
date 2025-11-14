import { Exclude } from 'class-transformer';
import { User, UserRole } from 'generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  id: number;
  username: string;
  email: string;

  @ApiProperty({ enum: Object.values(UserRole), enumName: 'UserRole' })
  role: UserRole;

  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
