import { prismaClient } from '@src/prisma/client';
import { ServiceInternalError } from '@src/util/errors/api-error';

interface IAuthRequest {
  username: string;
  password: string;
}

export class AuthenticateUserUseCasa {
  async handleAuthUser({ username, password }: IAuthRequest) {
    // Verificar se usuário existe
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        username,
      },
    });

    if (!userAlreadyExists)
      throw new ServiceInternalError('User ou password invalid!', 'Please check the username and/or password and try again.');
  }
}
