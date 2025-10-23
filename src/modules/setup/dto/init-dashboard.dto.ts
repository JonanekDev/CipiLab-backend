import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  NotContains,
} from 'class-validator';

export class InitDashboardDto {
  @IsOptional()
  @IsString()
  dashboardName: string;

  @Length(3, 30)
  @IsAlphanumeric()
  @NotContains(' ')
  username: string;

  @IsEmail()
  email: string;

  // Maybe víc? 12, 16?
  @IsStrongPassword({ minLength: 8 })
  password: string;
}
