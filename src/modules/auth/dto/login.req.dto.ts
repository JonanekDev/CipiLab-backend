import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginReqDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  rememberMe: boolean;
}
