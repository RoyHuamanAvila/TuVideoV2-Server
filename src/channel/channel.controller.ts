import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  Inject,
  Body,
  Patch,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { UserService } from 'src/user/user.service';
import { NotFoundException } from '@nestjs/common/exceptions';
import axios from 'axios';
import { CreateChannel, UpdateChannel } from './channel.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ChannelDocument } from './channel.schema';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Inject(UserService)
  userService: UserService;

  @Inject(CloudinaryService)
  cloudinaryService: CloudinaryService;

  @Get(':id')
  async getChannel(@Param('id') id: string) {
    return this.channelService.getChannel(id);
  }

  @Get('/')
  async getChannels() {
    const DOMAIN = process.env.AUTH0_DOMAIN;
    console.log(DOMAIN);
    return await this.channelService.getChannels();
  }

  @Post('/')
  async createChannel(@Req() req, @Body() channelData: CreateChannel) {
    const { auth0ID, token, userInfo } = req;
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
          const logoUploaded = await this.cloudinaryService.uploadImages(logo);

          dataToUpdate = {
            ...dataToUpdate,
            logo: logoUploaded.secure_url,
          };
        }

        if (banner) {
          const bannerUpload = await this.cloudinaryService.uploadImages(
            banner,
          );

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
      console.log(error);
    }
  }
}
