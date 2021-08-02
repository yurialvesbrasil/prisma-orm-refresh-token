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
      if (!refreshToken)
        return this.sendErrorResponse(response, {
          message: `Lack, security parameters.`,
          description: `Check the security parameters sent.`,
          code: 400,
        });
      const refreshTokenCode = refreshToken.split(' ');
      const refreshTokenUserUseCase = new RefreshTokenUserUseCase();
      const token = await refreshTokenUserUseCase.refreshToken(
        refreshTokenCode[1]
      );
      if (!token)
        return this.sendErrorResponse(response, {
          message: `Não foi possível gerar o token`,
          description: `Toquen não gerado`,
          code: 500,
        });

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
