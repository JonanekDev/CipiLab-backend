import { IsEmail, Matches } from 'class-validator';
import { UsernameDto } from './username.dto';

export class UpdateProfileReqDto extends UsernameDto {
  @IsEmail()
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message: 'Invalid email format.',
  })
  email: string;
}
