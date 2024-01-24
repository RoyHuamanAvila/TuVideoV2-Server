import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import axios from 'axios';
import { NextFunction, Response } from 'express';
import { ChannelService } from 'src/channel/channel.service';
import { CustomRequest } from 'src/interfaces';

@Injectable()
export class VerifyChannel implements NestMiddleware {
  constructor(private readonly channelService: ChannelService) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { userInfo, token } = req;
      const { channel } = userInfo.user_metadata;
      console.log('verifying channel: ');

      if (!channel)
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: 'This user needs a channel' });

      const foundChannel = await this.channelService.getChannel(channel);

      const auth0Domain = process.env.AUTH0_DOMAIN;
      const auth0ID = userInfo.user_id;

      if (!foundChannel) {
        console.log('Channel not found');

        const response = await axios.request({
          url: `${auth0Domain}/api/v2/users/${auth0ID}`,
          method: 'PATCH',
          headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
          },
          data: {
            user_metadata: {
              channel: null,
            },
          },
        });

        console.log('response: ', response.data);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: 'Channel not found' });
      }

      req.channel = channel;
      next();
    } catch (error) {
      console.error('Error in VerifyChannel middleware: ', error);
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: 'Failed to verify user channel' });
    }
  }
}
