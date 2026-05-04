import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

/**
 * CloudinaryService — thin wrapper around the Cloudinary v2 SDK.
 *
 * Configured once from env vars and used by any module that needs
 * to upload or delete assets. Scoped to the 'profile-avatars' folder.
 */
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key:    this.config.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Upload a file buffer to Cloudinary.
   *
   * @param buffer  — raw image bytes from multer memory storage
   * @param publicId — deterministic ID so re-uploads overwrite the old asset
   * @returns        the Cloudinary secure HTTPS URL
   */
  async uploadBuffer(buffer: Buffer, publicId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'profile-avatars',
            public_id: publicId,
            overwrite: true,
            resource_type: 'image',
            transformation: [
              // Crop to a square, resize to 400×400 and convert to WebP
              { width: 400, height: 400, crop: 'fill', gravity: 'face' },
              { fetch_format: 'webp', quality: 'auto' },
            ],
          },
          (error, result: UploadApiResponse | undefined) => {
            if (error || !result) {
              this.logger.error('Cloudinary upload failed', error);
              reject(error ?? new Error('Cloudinary upload returned no result'));
            } else {
              resolve(result.secure_url);
            }
          },
        )
        .end(buffer);
    });
  }

  /**
   * Delete an asset from Cloudinary by its public ID.
   * Used when a user replaces their avatar (cleanup old asset).
   */
  async deleteByPublicId(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(`profile-avatars/${publicId}`);
  }
}
