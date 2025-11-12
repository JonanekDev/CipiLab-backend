import { Exclude } from "class-transformer";
import { UserRole } from "generated/prisma";
import { ApiProperty } from '@nestjs/swagger';


export class UserEntity {
    id: number;
    username: string;
    email: string;

    @ApiProperty({ enum: Object.values(UserRole), enumName: 'UserRole' })
    role: UserRole;

    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
