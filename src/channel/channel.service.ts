import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Channel, ChannelDocument } from './channel.schema';
import { Model, Types } from 'mongoose';
import { CreateChannel, UpdateChannel } from './channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<ChannelDocument>,
  ) {}

  async getChannel(id: string) {
    return this.channelModel.findById(id).populate(['owner']);
  }

  /*   async getChannelResume(id: string) {
    const channel = await this.channelModel
      .findById(id)
      .select('ChannelResume')
      .exec();
    return channel;
  } */

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
      { new: true },
    );
    return updatedChannel;
  }

  async deleteChannel(id: string) {
    try {
      const deletedChannel = this.channelModel.findByIdAndDelete(id);
      return deletedChannel;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addVideo(channelId: string, newId: Types.ObjectId) {
    try {
      const updatedChannel = this.channelModel.findOneAndUpdate(
        { _id: channelId },
        {
          $push: {
            videos: newId,
          },
        },
        { new: true },
      );
      return updatedChannel;
    } catch (error) {}
  }

  async subscribe(idToSubscribe: string, channelID: string) {
    /* try {
      const channelFound = await this.channelModel.findById(idToSubscribe);

      const foundRepeat = channelFound.subscribes.find(
        (channel) => channel._id.toString() === idToSubscribe,
      );

      if (foundRepeat) throw new Error('Subscription repeat');

      await this.channelModel.findByIdAndUpdate(idToSubscribe, {
        $push: {
          subscribers: channelID,
        },
      });

      const channelUpdated = await this.channelModel
        .findByIdAndUpdate(
          channelID,
          {
            $push: {
              subscribes: idToSubscribe,
            },
          },
          { new: true },
        )
        .populate('subscribes');

      const subscription = channelUpdated.subscribes.find(
        (channel) => channel._id.toString() === idToSubscribe,
      );
      return subscription?.['ChannelResume'];
    } catch (error) {} */
  }

  async unSuscribe(idToUnsubscribe: string, channelID: string) {
    /*  try {
      const channelUpdated = await this.channelModel
        .findByIdAndUpdate(channelID, {
          $pull: {
            subscribes: idToUnsubscribe,
          },
        })
        .populate('subscribes');

      await this.channelModel.findByIdAndUpdate(idToUnsubscribe, {
        $pull: {
          subscribers: channelID,
        },
      });

      const subscription = channelUpdated.subscribes.find(
        (channel) => channel._id.toString() === idToUnsubscribe,
      );

      return subscription?.['ChannelResume'];
    } catch (error) {} */
  }
}
