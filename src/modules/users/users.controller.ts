import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ChangePasswordReqDto } from './dto/changepassword.req.dto';
import type { FastifyRequest } from 'fastify';
import { UsersService } from './users.service';
import { UserSession } from 'generated/prisma';
import { UpdateProfileReqDto } from './dto/update-profile.req.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UsersController {

    constructor(private readonly usersService:  UsersService) {}

    @Post('changepassword')
    @HttpCode(204)
    async changePassword(@Body() dto: ChangePasswordReqDto, @Req() req: FastifyRequest): Promise<void> {
        if (dto.password == dto.currentPassword) {
            throw new BadRequestException('New password must be different from current password');
        }
        if (!req['userId']) {
            throw new UnauthorizedException();
        }
        await this.usersService.changePassword(req['userId'], dto);
    }

    @Post('updateprofile')
    @HttpCode(204)
    async updateProfile(@Body() dto: UpdateProfileReqDto, @Req() req: FastifyRequest): Promise<void> {
        if (!req['userId']) {
            throw new UnauthorizedException();
        }
        await this.usersService.updateProfile(req['userId'], dto);
    }

    @Get('sessions')
    async getActiveSessions(@Req() req: FastifyRequest): Promise<UserSession[]> {
        if (!req['userId']) {
            throw new UnauthorizedException();
        }
        return this.usersService.getActiveSessions(req['userId']);
    }
}
