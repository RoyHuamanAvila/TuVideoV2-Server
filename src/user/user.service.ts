import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUser, UpdateUser } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUser: CreateUser): Promise<User> {
    const createdUser = new this.userModel(createUser);
    return createdUser.save();
  }

  async getUserByID(id: string): Promise<User> {
    const foundUser = this.userModel.findById(id);
    if (!foundUser) throw new NotFoundException();
    return foundUser;
  }

  async getUserByEmail(email: string) {
    const foundUser = this.userModel.findOne({ email });
    return foundUser;
  }

  async getUsers(): Promise<User[]> {
    const foundUsers = this.userModel.find({}).populate('channel');
    return foundUsers;
  }

  async updateOneUser(filter, data: UpdateUser): Promise<User> {
    const updatedUser = this.userModel.findOneAndUpdate(filter, data, {
      new: true,
    });
    return updatedUser;
  }

  async updateByIDUser(id: string, postData: UpdateUser): Promise<User> {
    const updatedUser = this.userModel.findByIdAndUpdate(
      { _id: id },
      postData,
      {
        new: true,
      },
    );
    return updatedUser;
  }

  async deleteUser(id: string): Promise<User> {
    const deletedUser = this.userModel.findByIdAndDelete(id);
    return deletedUser;
  }
}
