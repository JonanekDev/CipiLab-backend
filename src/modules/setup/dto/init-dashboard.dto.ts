import {
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsOptional,
  IsString,
  Length,
  MinLength,
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
  @MinLength(8)
  @IsString()
  password: string;
}
