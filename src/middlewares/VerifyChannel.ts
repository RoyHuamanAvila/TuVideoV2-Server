import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { CustomRequest } from 'src/interfaces';

@Injectable()
export class VerifyChannel implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { userInfo } = req;
      const { channel } = userInfo.user_metadata;

      if (!channel)
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: 'This user needs a channel' });
      next();
    } catch (error) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: 'Failed to verify user channel' });
    }
  }
}
