import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './channel.schema';
import { Model } from 'mongoose';
import { CreateChannel, UpdateChannel } from './channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
  ) {}

  async getChannel(id: string): Promise<Channel> {
    return this.channelModel.findById(id);
  }

  async getChannels(): Promise<Channel[]> {
    return this.channelModel.find({}).populate('owner');
  }

  async createChannel(createChannel: CreateChannel) {
    const createdChannel = new this.channelModel(createChannel);
    return createdChannel.save();
  }

  async updateChannel(id: string, updateChannel: UpdateChannel) {
    const updatedChannel = this.channelModel.findByIdAndUpdate(
      id,
      updateChannel,
    );
    return updatedChannel;
  }
}
