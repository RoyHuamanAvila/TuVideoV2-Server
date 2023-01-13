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
import { VerifyToken } from './middlewares/VerifyToken';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Channel.name,
        useFactory: () => {
          const Schema = ChannelSchema;
          Schema.pre('save', function () {
            console.log('Hello from pre save');
          });
          return Schema;
        },
      },
    ]),
    UserModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyToken)
      .forRoutes(
        { path: '/channel', method: RequestMethod.POST },
        { path: '/channel', method: RequestMethod.PATCH },
      );
  }
}
