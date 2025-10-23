import { User } from 'generated/prisma';
import { TokenRefreshResDto } from './token-refresh.res.dto';

export class LoginResDto {
  user: User;
  tokens: TokenRefreshResDto;
}
