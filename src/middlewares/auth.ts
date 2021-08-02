import AuthService from '@src/services/AuthService';
import ApiError, { APIError } from '@src/util/errors/api-error';
import { NextFunction, Request, Response } from 'express';

function sendAuthErrorResponse(res: Response, apiError: APIError): Response {
  return res.status(apiError.code).send(ApiError.format(apiError));
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers?.authorization;
  try {
    if (!authorization) {
      sendAuthErrorResponse(res, {
        message: 'Security parameters are missing.',
        description: 'Security token has not been sent.',
        code: 400,
      });
    } else {
      const token = authorization.split(' ');
      const claims = AuthService.decodeToken(token[1] as string);
      req.params.userId = claims.sub;
      req.params.name = claims.name;
      next();
    }
  } catch (error) {
    sendAuthErrorResponse(res, {
      message: `${error.message}`,
      description: `${error.description}`,
      code: 500,
    });
  }
}
