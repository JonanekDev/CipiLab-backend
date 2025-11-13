import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PasswordDto } from 'src/modules/auth/dto/password.dto';

export class ChangePasswordReqDto extends PasswordDto {
  @IsString()
  @MinLength(1)
  currentPassword: string;
}
