import { UserEntity } from "src/modules/users/user.entity";

export class StatusResponseDto {
    setupCompleted: boolean;
    serverName?: string;
    user?: UserEntity;
}