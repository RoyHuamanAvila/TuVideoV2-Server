import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 } from 'cloudinary';

@Module({
  providers: [
    {
      provide: 'Cloudinary',
      useFactory: () => {
        return v2.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET,
        });
      },
    },
    CloudinaryService,
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
