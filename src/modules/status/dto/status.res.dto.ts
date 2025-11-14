import { UserEntity } from 'src/modules/users/entities/user.entity';

export class StatusResponseDto {
  setupCompleted: boolean;
  serverName?: string;
  user?: UserEntity;
}
