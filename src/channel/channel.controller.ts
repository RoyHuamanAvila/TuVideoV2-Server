import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  Inject,
  Body,
  Patch,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { UserService } from 'src/user/user.service';
import { NotFoundException } from '@nestjs/common/exceptions';
import axios from 'axios';
import { CreateChannel, UpdateChannel } from './channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Inject(UserService)
  userService: UserService;

  @Get('/:id')
  async getChannel(@Param('id') id: string) {
    return await this.channelService.getChannel(id);
  }

  @Get('/')
  async getChannels() {
    const DOMAIN = process.env.AUTH0_DOMAIN;
    console.log(DOMAIN);
    return await this.channelService.getChannels();
  }

  @Post('/')
  async createChannel(@Req() req, @Body() channelData: CreateChannel) {
    const { auth0ID, token, userInfo } = req.body;
    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

    try {
      const foundUser = await this.userService.getUserByEmail(userInfo.email);
      if (!foundUser) throw new NotFoundException();

      if (userInfo?.user_metadata?.channel)
        return { message: 'this user contain a channel' };

      if (!channelData.logo || !channelData.name)
        return { message: 'Paths necessaries' };

      const createdChannel = await this.channelService.createChannel({
        ...channelData,
        owner: foundUser._id,
      });

      const response = await axios.request({
        url: `${AUTH0_DOMAIN}/api/v2/users/${auth0ID}`,
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        },
        data: {
          user_metadata: {
            channel: createdChannel._id,
          },
        },
      });

      return {
        message: 'Channel created succesful',
        owner: foundUser._id,
        channel: createdChannel,
        user_metadata: response.data,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Patch('/')
  async updateChannel(@Req() req, @Body() channelData: UpdateChannel) {
    try {
      const { userInfo } = req.body;
      const channelID = userInfo.user_metadata.channel;

      if (!channelID) return { message: 'This user not contain a channel' };
      const updatedChannel = await this.channelService.updateChannel(
        channelID,
        channelData,
      );

      console.log(updatedChannel);
      return await updatedChannel;
    } catch (error) {
      console.log(error);
    }
  }
}
