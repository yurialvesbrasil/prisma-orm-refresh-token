import { prismaClient } from '../../prisma/client';
import { hash } from 'bcryptjs';
import { ServiceInternalError } from '@src/util/errors/api-error';

interface IUserRequest {
  name: string;
  password: string;
  username: string;
}

export class CreationUserUseCase {
  async create({ name, password, username }: IUserRequest) {
    /* Verifica se usuário existe */
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        username: username,
      },
    });

    if (userAlreadyExists)
      throw new ServiceInternalError('User already exists!','This username already belongs to an already registered user.');

    /* Cadastra o usuário */
    const passwordHash = await hash(password, 8);
    const user = await prismaClient.user.create({
      data: {
        name,
        password: passwordHash,
        username,
      },
    });

    return user;
  }
}
