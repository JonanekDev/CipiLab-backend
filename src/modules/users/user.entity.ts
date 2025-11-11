import { Exclude } from "class-transformer";


export class UserEntity {
    id: number;
    username: string;
    email: string;

    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
