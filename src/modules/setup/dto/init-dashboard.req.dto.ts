import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class InitDashboardReqDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  serverName: string;

  @Length(3, 30)
  @IsAlphanumeric()
  @NotContains(' ')
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores.',
  })
  username: string;

  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Invalid email format.',
  })
  email: string;

  // Maybe víc? 12, 16?
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
}
