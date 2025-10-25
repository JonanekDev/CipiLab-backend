import { UserEntity } from "src/modules/users/user.entity";

export class StatusResponseDto {
    setupCompleted: boolean;
    user?: UserEntity;
}