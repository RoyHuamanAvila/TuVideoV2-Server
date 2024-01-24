import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Req,
  Inject,
  Body,
  Patch,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { UserService } from '../user/user.service';
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import axios from 'axios';
import { CreateChannel, UpdateChannel } from './channel.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CustomRequest, UserData } from '../interfaces';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Inject(UserService)
  userService: UserService;

  @Inject(CloudinaryService)
  cloudinaryService: CloudinaryService;

  @Get(':id')
  async getChannel(@Param('id') id: string) {
    const foundChannel = await this.channelService.getChannel(id);
    return foundChannel.populate(['subscribes', 'owner']);
  }

  @Get('/')
  async getChannels() {
    return await this.channelService.getChannels();
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('logo'))
  async createChannel(
    @UploadedFile() logo,
    @Req() req,
    @Body() channelData: CreateChannel,
  ) {
    console.log('Creating channel');
    console.log('channelData: ', channelData);
    const { auth0ID, token, userInfo } = req;
    console.log('Logo', logo);
    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

    try {
      const foundUser = await this.userService.getUserByEmail(userInfo.email);
      if (!foundUser) throw new NotFoundException();

      if (userInfo?.user_metadata?.channel)
        throw new HttpException(
          'This user already has a channel',
          HttpStatus.CONFLICT,
        );

      if (!logo || !channelData.name)
        throw new HttpException(
          'You need to provide a name and logo',
          HttpStatus.BAD_REQUEST,
        );

      const logoUploaded = await this.cloudinaryService.uploadImage([logo]);
      const { secure_url } = logoUploaded;
      console.log('Logo uploaded: ', secure_url);

      channelData = {
        ...channelData,
        logo: secure_url,
      };

      const createdChannel = await this.channelService.createChannel({
        ...channelData,
        owner: foundUser._id,
      });
      console.log('Channel created: ', createdChannel);

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
      console.log('Response from auth0: ', response.data);

      return {
        message: 'Channel created successful',
        owner: foundUser._id,
        channel: createdChannel,
        user_metadata: response.data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Patch('/')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
    ]),
  )
  async updateChannel(
    @Req() req,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      banner?: Express.Multer.File[];
    },
    @Body() dataToUpdate: UpdateChannel,
  ) {
    try {
      const { userInfo } = req;

      const channelID = userInfo.user_metadata?.channel;

      if (!channelID) return { message: 'This user not contain a channel' };

      if (files) {
        const { logo, banner } = files;

        if (logo) {
          const logoUploaded = await this.cloudinaryService.uploadImage(logo);

          dataToUpdate = {
            ...dataToUpdate,
            logo: logoUploaded.secure_url,
          };
        }

        if (banner) {
          const bannerUpload = await this.cloudinaryService.uploadImage(banner);

          dataToUpdate = {
            ...dataToUpdate,
            banner: bannerUpload.secure_url,
          };
        }
      }

      const updatedChannel = await this.channelService.updateChannel(
        channelID,
        dataToUpdate,
      );
      return await updatedChannel;
    } catch (error) {
      console.log(error, 'Error to update');
    }
  }

  @Post('/subscribe/:id')
  async subscribeController(@Param('id') id: string, @Req() req) {
    try {
      const userInfo: UserData = req.userInfo;

      const subscription = await this.channelService.subscribe(
        id,
        userInfo.user_metadata.channel,
      );

      return subscription;
    } catch (error) {
      console.log(error);
      throw new Error('Error to suscribe');
    }
  }

  @Delete('/unsubscribe/:id')
  async unSuscribeController(@Param('id') id: string, @Req() req) {
    try {
      const userInfo: UserData = req.userInfo;

      const subscription = await this.channelService.unSuscribe(
        id,
        userInfo.user_metadata.channel,
      );

      return subscription;
    } catch (error) {
      console.log(error);
    }
  }

  @Delete('/')
  async deleteChannel(@Param('id') id: string, @Req() req: CustomRequest) {
    try {
      const { channelId } = req;

      if (!channelId)
        throw new HttpException(
          'This user not contain a channel',
          HttpStatus.NOT_FOUND,
        );

      const deletedChannel = await this.channelService.deleteChannel(channelId);

      if (!deletedChannel)
        throw new HttpException('Channel not found', HttpStatus.NOT_FOUND);

      return deletedChannel;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'There was a problem deleting the channel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
