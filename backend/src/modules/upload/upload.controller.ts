import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from './cloudinary.service.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

/**
 * UploadController — handles multipart file uploads.
 *
 * POST /api/upload/avatar
 *   - Accepts a single image file in the `avatar` field
 *   - Uses multer memory storage (no temp files on disk)
 *   - Uploads to Cloudinary and returns the public URL
 *   - Protected by the global ClerkAuthGuard
 *
 * The clerkId is embedded in the Cloudinary public_id so that
 * re-uploads overwrite the old asset (no orphaned files).
 */
@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only JPEG, PNG, WebP or HEIC images are allowed'), false);
        }
      },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { clerkId: string },
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file provided — send image in "avatar" field');
    }

    this.logger.log(`Uploading avatar for user ${user.clerkId} (${file.size} bytes)`);

    // Use clerkId as the Cloudinary public_id so repeat uploads overwrite
    const url = await this.cloudinary.uploadBuffer(file.buffer, user.clerkId);

    return { url };
  }
}
