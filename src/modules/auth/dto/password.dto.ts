import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class PasswordDto {
  @IsString()
  // Maybe víc? 12, 16?
  @MinLength(8)
  @MaxLength(128)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
}
