import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video, VideoDocument } from './video.schema';
import { Model } from 'mongoose';
import { CreateVideo } from './video.dto';
import { CreateComment } from 'src/comment/comment.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async createVideo(data: CreateVideo) {
    const createdVideo = new this.videoModel(data);
    createdVideo.populate('owner');
    return createdVideo.save();
  }

  async getVideos() {
    const foundedVideos = await this.videoModel
      .find({})
      .populate(['owner', { path: 'comments', populate: { path: 'owner' } }]);
    return foundedVideos;
  }

  async getVideosResume() {
    const foundedVideos = await this.videoModel
      .find({})
      .select('VideoResume')
      .exec();
    return foundedVideos;
  }

  async getVideosByOwner(owner: string) {
    const foundedVideos = await this.videoModel
      .find({ owner })
      .populate('owner');

    return foundedVideos;
  }

  async getVideoByID(id: string) {
    return await this.videoModel.findById(id).populate('owner');
  }

  async getCommentsInVideo(id: string) {
    return this.videoModel
      .findById(id, 'comments')
      .populate({ path: 'comments', populate: { path: 'owner' } })
      .exec();
  }

  async addCommentByID(videoID: string, comment: CreateComment) {
    return this.videoModel.findByIdAndUpdate(videoID, {
      $push: {
        comments: comment,
      },
    });
  }
}
