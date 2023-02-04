import {
  Controller,
  Param,
  Body,
  Req,
  Res,
  Post,
  Inject,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateComment } from './comment.dto';
import { CustomRequest } from 'src/interfaces';
import { Response } from 'express';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';
import { HttpStatusCode } from 'axios';
import { VideoService } from 'src/video/video.service';
import { ChannelService } from 'src/channel/channel.service';
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Inject(UserService)
  userService: UserService;

  @Inject(VideoService)
  videoService: VideoService;

  @Inject(ChannelService)
  channelService: ChannelService;

  @Post('/:id')
  async createCommentController(
    @Param('id') videoID: string,
    @Req() req: CustomRequest,
    @Body() data: CreateComment,
    @Res() res: Response,
  ) {
    try {
      const { email, user_metadata } = req.userInfo;
      const foundUser = await this.userService.getUserByEmail(email);
      if (!foundUser)
        return res
          .status(HttpStatusCode.NotFound)
          .json({ error: 'User not found' });

      const foundChannel = await this.channelService.getChannel(
        user_metadata.channel,
      );
      if (!foundChannel)
        return res
          .status(HttpStatusCode.NotFound)
          .json({ error: 'Neccesary channel' });

      const foundVideo = await this.videoService.getVideoByID(videoID);
      if (!foundVideo)
        return res
          .status(HttpStatusCode.NotFound)
          .json({ error: 'Video not found' });

      const createdComment = await this.commentService.createComment({
        ...data,
        owner: foundChannel._id,
        videoID: foundVideo._id,
      });

      await this.videoService.addCommentByID(videoID, createdComment);

      return res
        .status(HttpStatusCode.Created)
        .json({ succes: 'Created comment', createdComment });
    } catch (error) {
      return res
        .status(HttpStatusCode.BadGateway)
        .json({ error: 'Failed to create comment' });
    }
  }

  @Patch(':id')
  async editCommentController(
    @Param('id') id: string,
    @Body() comment: CreateComment,
  ) {
    return this.commentService.updateComment(id, comment.content);
  }

  @Delete(':id')
  async deleteCommentController(@Param('id') id: string) {
    return this.commentService.deleteComment(id);
  }
}
