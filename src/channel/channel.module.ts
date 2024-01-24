import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './channel.schema';
import { ChannelController } from './channel.controller';
import { VerifyToken } from '../middlewares/VerifyToken';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express/multer';
import { VerifyChannel } from 'src/middlewares/VerifyChannel';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema }]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    UserModule,
    CloudinaryModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyToken).forRoutes({
      path: '/channel',
      method: RequestMethod.POST,
    });
    consumer
      .apply(VerifyToken, VerifyChannel)
      .forRoutes(
        { path: '/channel', method: RequestMethod.PATCH },
        { path: '/channel', method: RequestMethod.DELETE },
        { path: '/channel/subscribe/:id', method: RequestMethod.POST },
        { path: '/channel/unsubscribe/:id', method: RequestMethod.DELETE },
      );
  }
}
