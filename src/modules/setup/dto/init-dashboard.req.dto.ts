import { IntersectionType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PasswordDto } from 'src/modules/auth/dto/password.dto';
import { UsernameDto } from 'src/modules/users/dto/username.dto';

export class InitDashboardReqDto extends IntersectionType(PasswordDto, UsernameDto) {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  serverName: string;

  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Invalid email format.',
  })
  email: string;
}
