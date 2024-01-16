import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { Test } from '@nestjs/testing';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UserService } from '../user/user.service';

describe('ChannelController', () => {
  let controller: ChannelController;
  let service: ChannelService;
  let userService: UserService;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [
        { provide: ChannelService, useValue: { createChannel: jest.fn() } },
        { provide: UserService, useValue: { getUserByEmail: jest.fn() } },
        { provide: CloudinaryService, useValue: { upload: jest.fn() } },
      ],
    }).compile();

    service = moduleRef.get<ChannelService>(ChannelService);
    userService = moduleRef.get<UserService>(UserService);
    controller = moduleRef.get<ChannelController>(ChannelController);
    cloudinaryService = moduleRef.get<CloudinaryService>(CloudinaryService);
  });

  it('should create a channel and update user metadata in Auth0', async () => {
    const req = {
      auth0ID: 'auth0|123456789',
      token: 'token',
      userInfo: {
        email: 'email',
        user_metadata: {},
      },
    };

    const channelData = {
      logo: 'logo',
      name: 'name',
    };

    const user = { _id: '123456789' };
    const channel = { _id: '567890123' };

    (userService.getUserByEmail as jest.Mock).mockResolvedValue(user);
    (service.createChannel as jest.Mock).mockResolvedValue(channel);

    mockedAxios.request.mockResolvedValue({ data: {} });

    const result = await controller.createChannel(req, channelData);
    expect(result).toEqual({
      message: 'Channel created successful',
      owner: user._id,
      channel,
      user_metadata: {},
    });
  });
});
