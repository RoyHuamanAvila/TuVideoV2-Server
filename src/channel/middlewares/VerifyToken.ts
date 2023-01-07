import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { verify } from 'jsonwebtoken';
import { join } from 'path';
import axios from 'axios';

@Injectable()
export class VerifyToken implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    try {
      const token = authorization.split('Bearer ')[1];
      const publicKey = readFileSync(join(__dirname, './public.pem'));
      const decoded = verify(token, publicKey);
      const auth0ID = decoded.sub as string;

      const userInfoAuth0 = await axios.request({
        url: `https://dev-t33ryzl7kfi0qfgq.us.auth0.com/api/v2/users/${auth0ID}`,
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
      });

      req.body.auth0ID = auth0ID;
      req.body.token = token;
      req.body.userInfo = userInfoAuth0.data;

      next();
    } catch (error) {
      console.log(error);
    }
  }
}
