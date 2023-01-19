import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { VerifyToken } from 'src/channel/middlewares/VerifyToken';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from './video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    CloudinaryModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyToken)
      .forRoutes({ path: '/video', method: RequestMethod.POST });
  }
}
