import { prismaClient } from '@src/prisma/client';
import AuthService from '@src/services/AuthService';
import { ServiceInternalError } from '@src/util/errors/api-error';

export class RefreshTokenUserUseCase {
  async refreshToken(refresh_token: string) {
    const refreshTokenObject = await prismaClient.refreshToken.findFirst({
      where: {
        id: refresh_token,
      },
      include: {
        user: true,
      },
    });

    if (!refreshTokenObject)
      throw new ServiceInternalError(
        'Refresh token invalid',
        'The Refresh Token informed was not found in the records.'
      );

    const token = AuthService.generateToken(
      refreshTokenObject.userId,
      refreshTokenObject.user.name
    );

    return token;
  }
}
