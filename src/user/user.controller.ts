import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { UpdateUser } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/')
  async createUser(@Body() user: User): Promise<User> {
    return await this.userService.createUser(user);
  }

  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.userService.getUsers();
  }

  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserByID(id);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() post: UpdateUser,
  ): Promise<User> {
    const updatedUser = this.userService.updateByIDUser(id, post);
    if (!updatedUser) throw new NotFoundException();
    return await updatedUser;
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    const deletedUser = this.userService.deleteUser(id);
    if (!deletedUser) throw new NotFoundException();
    return await deletedUser;
  }
}
