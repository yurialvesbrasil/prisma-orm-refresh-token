import { prismaClient } from '@src/prisma/client';
import dayjs from 'dayjs';

export class GenerateRefreshToken {
  async createRefreshToken(userId: string) {
    const expiresIn = dayjs().add(1, 'week').unix();

    const generateRefreshToken = await prismaClient.refreshToken.create({
      data: {
        userId,
        expiresIn,
      },
    });

    return generateRefreshToken;
  }
}
