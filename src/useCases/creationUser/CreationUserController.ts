import { Controller, Post } from '@overnightjs/core/lib/decorators';
import { Request, Response } from 'express';
import { BaseController } from '../BaseController';
import { CreationUserUseCase } from './CreationUserUseCase';

@Controller('users')
export class CreationUserController extends BaseController {
  @Post()
  async handleUserCreation(request: Request, response: Response) {
    const { username, name, password } = request.body;

    const creationUserUseCase = new CreationUserUseCase();
    try {
      const user = await creationUserUseCase.create({
        username,
        name,
        password,
      });

      delete user.password;
      return response.json(user);
    } catch (error) {
      return this.sendErrorResponse(response, {
        message: `${error.message}`,
        description: `${error.description}`,
        code: 500,
      });
    }
  }
}
