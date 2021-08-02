import { prismaClient } from '@src/prisma/client';
import AuthService from '@src/services/AuthService';
import { ServiceInternalError } from '@src/util/errors/api-error';

export interface IAuthRequest {
  username: string;
  password: string;
}

export class AuthenticateUserUseCasa {
    async generationAuthUserToken({ username, password }: IAuthRequest) {
        /* Verificar se usuário existe */
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                username,
            },
        });

        if (!userAlreadyExists)
            throw new ServiceInternalError('User ou password invalid!', 'Please check the username and/or password and try again.');
        
        /* Verificar se a senha está correta */ 
        const passwordMatch = await AuthService.comparePasswords(password, userAlreadyExists.password);

        if(!passwordMatch)
            throw new ServiceInternalError('User ou password invalid!', 'Please check the username and/or password and try again.');

        /* Gera token JWT */    
        const token = AuthService.generateToken(userAlreadyExists.id, userAlreadyExists.name);

        return token;
    }

}
