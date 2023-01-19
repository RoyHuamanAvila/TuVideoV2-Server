import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Inject,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { UserData } from 'src/interfaces';
import { VideoService } from './video.service';
import { CreateVideo } from './video.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { UploadedFiles } from '@nestjs/common/decorators';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Inject(CloudinaryService)
  cloudinaryService: CloudinaryService;

  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async createVideo(
    @Req() req,
    @Body() data: CreateVideo,
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
  ) {
    try {
      console.log('entry');
      const userInfo: UserData = req.userInfo;
      const { channel } = userInfo.user_metadata;

      if (!channel) return { message: 'This user not contain a user' };

      if (files) {
        const { video, thumbnail } = files;
        const videoUploaded = await this.cloudinaryService.uploadVideo(video);

        const thumbnailUploaded = await this.cloudinaryService.uploadImages(
          thumbnail,
        );

        const createdVideo = await this.videoService.createVideo({
          ...data,
          owner: new mongoose.Types.ObjectId(channel),
          thumbnail: thumbnailUploaded.secure_url,
          url: videoUploaded.secure_url,
        });

        return createdVideo;
      }
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/')
  async getVideosController() {
    return this.videoService.getVideos();
  }

  @Get('/:id')
  async getVideosByOwnerController(@Param('id') id: string) {
    return this.videoService.getVideosByOwner(id);
  }

  @Get('/resume')
  async getVideosResumeController() {
    return this.videoService.getVideosResume();
  }
}