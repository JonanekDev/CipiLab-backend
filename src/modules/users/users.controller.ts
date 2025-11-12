import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ChangePasswordReqDto } from './dto/changepassword.req.dto';
import type { FastifyRequest } from 'fastify';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {

    constructor(private readonly usersService:  UsersService) {}

    @UseGuards(AuthGuard)
    @Post('changepassword')
    async changePassword(@Body() dto: ChangePasswordReqDto, @Req() req: FastifyRequest) {
        if (dto.newPassword == dto.currentPassword) {
            throw new Error('New password must be different from current password');
        }
        if (!req['userId']) {
            throw new UnauthorizedException('User not authenticated');
        }
        await this.usersService.changePassword(req['userId'], dto.newPassword);
    }
}
