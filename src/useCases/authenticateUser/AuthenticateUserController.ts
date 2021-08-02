import { Controller, Get, Post } from '@overnightjs/core/lib/decorators';
import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { AuthenticateUserUseCasa, IAuthRequest } from './AuthenticateUserUseCasa';

@Controller('users')
export class AuthenticateUserController extends BaseController {
    @Post('login')
    async handleGenerationToken(request: Request, response: Response) {
        try {
            const { username, password }: IAuthRequest = request.body;
            const authenticateUserUseCasa = new AuthenticateUserUseCasa();
            const token = await authenticateUserUseCasa.generationAuthUserToken({
                username,
                password
            })
            return response.status(200).json({code: 200, message: token});
        } catch (error) {
            return this.sendErrorResponse(response, {
                message: `${error.message}`,
                description: `${error.description}`,
                code: 500,
            });
        }
    }
}