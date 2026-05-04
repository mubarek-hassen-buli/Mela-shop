import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller.js';
import { CloudinaryService } from './cloudinary.service.js';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [CloudinaryService],
  /** Export so UsersModule can inject CloudinaryService if needed */
  exports: [CloudinaryService],
})
export class UploadModule {}
