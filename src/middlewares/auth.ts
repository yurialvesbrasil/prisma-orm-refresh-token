import AuthService from "@src/services/AuthService";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const token = req.headers?.['x-access-token'];
    try {
      if (!token){
        res
          .status(400)
          .send({ code: 400, error: 'Faltam parâmentros de segurança.' });
      }else{
        const claims = AuthService.decodeToken(token as string);
        req.params.userId = claims.sub;
        next();
      }
    } catch (err) {
      res.status(401).send({ code: 401, error: err.message });
    }
  }