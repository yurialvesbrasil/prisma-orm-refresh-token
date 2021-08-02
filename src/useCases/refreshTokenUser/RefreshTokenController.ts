import { Controller, Post } from '@overnightjs/core/lib/decorators';
import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { RefreshTokenUserUseCase } from './RefreshTokenUserUseCase';

@Controller('users')
export class RefreshTokenController extends BaseController {

    @Post('refresh')
    async handleRefreshToken(request: Request, response: Response) {
        try {
            const refreshToken = request.headers.authorization;
            const refreshTokenUserUseCase = new RefreshTokenUserUseCase();
            const token = refreshTokenUserUseCase.refreshToken(refreshToken);
            return response.status(200).json({ code: 200, token: token });
        } catch (error) {
            return this.sendErrorResponse(response, {
                message: `${error.message}`,
                description: `${error.description}`,
                code: 500,
            });
        }
    }
}