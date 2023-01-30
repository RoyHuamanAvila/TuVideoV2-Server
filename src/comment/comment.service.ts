import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateComment } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async createComment(data: CreateComment) {
    const newComment = await new this.commentModel(data).populate('owner');
    return newComment.save();
  }

  async getComment(commentID: string) {
    return this.commentModel.findById(commentID);
  }

  async getCommentsInVideo(videoID: string) {
    return this.commentModel.find({ videoID });
  }

  async updateComment(commentID: string, newContent: string) {
    return this.commentModel.findByIdAndUpdate(
      commentID,
      {
        content: newContent,
      },
      { new: true },
    );
  }

  async deleteComment(commentID: string) {
    return this.commentModel.findByIdAndDelete(commentID);
  }
}
