import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { readFileSync } from 'fs';
import { verify } from 'jsonwebtoken';
import { join } from 'path';
import axios, { HttpStatusCode } from 'axios';
import { CustomRequest } from 'src/interfaces/index';

@Injectable()
export class VerifyToken implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      if (!authorization)
        return res
          .status(HttpStatusCode.Forbidden)
          .json({ error: 'Needs token' });

      const token = authorization.split('Bearer ')[1];
      const publicKey = process.env.PEM;
      console.log(publicKey);

      const decoded = verify(token, publicKey);
      if (!decoded)
        return res
          .status(HttpStatusCode.Forbidden)
          .json({ error: 'Failed to verify token' });

      const auth0ID = decoded.sub as string;

      const userInfoAuth0 = await axios.request({
        url: `https://dev-t33ryzl7kfi0qfgq.us.auth0.com/api/v2/users/${auth0ID}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      });

      req.auth0ID = auth0ID;
      req.token = token;
      req.userInfo = userInfoAuth0.data;
      next();
    } catch (error) {
      return res.status(HttpStatusCode.Forbidden).json({ error });
    }
  }
}
