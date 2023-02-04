import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { CommentController } from './comment.controller';
import { UserModule } from 'src/user/user.module';
import { VideoModule } from 'src/video/video.module';
import { VerifyToken } from 'src/middlewares/VerifyToken';
import { VerifyChannel } from 'src/middlewares/VerifyChannel';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UserModule,
    VideoModule,
    ChannelModule,
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyToken, VerifyChannel)
      .forRoutes(
        { path: '/comment/:id', method: RequestMethod.POST },
        { path: '/comment/:id', method: RequestMethod.PATCH },
        { path: '/comment/:id', method: RequestMethod.DELETE },
      );
  }
}
