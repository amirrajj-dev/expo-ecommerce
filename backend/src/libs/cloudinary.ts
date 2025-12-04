import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../configs/env';
import logger from '../logging/logger';

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (
  file: Express.Multer.File,
): Promise<{ secure_url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'auto',
      folder: 'expo-commerce-products',
    });
    logger.info('image uploaded succesfully');
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    logger.error(`Error in Cloudinary upload => ${error instanceof Error ? error.message : error}`);
    throw new Error('Error uploading file to Cloudinary');
  }
};

export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw',
) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    logger.error(
      `Failed to delete ${publicId} from Cloudinary => ${error instanceof Error ? error.message : error}`,
    );
    throw new Error(`Failed to delete ${publicId} from Cloudinary`);
  }
};

export default cloudinary;
