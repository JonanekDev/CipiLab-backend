import { TokenRefreshResDto } from './token-refresh.res.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class LoginResDto {
  user: UserEntity;
  session: TokenRefreshResDto;
}
