import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File[],
    channelID: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      const { path, fieldname } = file[0];
      return await v2.uploader.upload(path, {
        public_id: `${channelID}-${fieldname}`,
      });
    } catch (error) {
      return error;
    }
  }
}
