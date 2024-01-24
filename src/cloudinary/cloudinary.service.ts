import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import { unlinkSync } from 'fs';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File[],
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (!file || file.length === 0) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const { path } = file[0];
      const response = await v2.uploader.upload(path);
      unlinkSync(path);
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
