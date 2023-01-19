import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImages(
    file: Express.Multer.File[],
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const { path } = file[0];
      return await v2.uploader.upload(path);
    } catch (error) {
      return error;
    }
  }

  async uploadVideo(
    file: Express.Multer.File[],
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const { path } = file[0];
      return await v2.uploader.upload(path, { resource_type: 'video' });
    } catch (error) {
      return error;
    }
  }
}
