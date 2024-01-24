import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import axios, { HttpStatusCode } from 'axios';
import { CustomRequest } from 'src/interfaces/index';

@Injectable()
export class VerifyToken implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      console.log('Verifying token');
      const { authorization } = req.headers;

      if (!authorization)
        throw new HttpException('Needs token', HttpStatusCode.Forbidden);

      const token = authorization.split('Bearer ')[1];
      if (!token) {
        throw new HttpException('Invalid token', HttpStatusCode.Forbidden);
      }

      const publicKey = process.env.PEM;
      const auth0Domain = process.env.AUTH0_DOMAIN;

      const decoded = verify(token, publicKey);
      if (!decoded)
        throw new HttpException('Invalid token', HttpStatusCode.Forbidden);

      const auth0ID = decoded.sub as string;

      const userInfoAuth0 = await axios
        .request({
          url: `${auth0Domain}/api/v2/users/${auth0ID}`,
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
        })
        .catch((error) => {
          console.log('Error in VerifyToken middleware: ', error);
          throw new HttpException('Invalid token', HttpStatusCode.Forbidden);
        });

      req.auth0ID = auth0ID;
      req.token = token;
      req.userInfo = userInfoAuth0.data;
      console.log('Token verified');
      next();
    } catch (error) {
      console.log('Error in VerifyToken middleware: ', error);
      throw new HttpException(error, HttpStatusCode.Forbidden);
    }
  }
}
