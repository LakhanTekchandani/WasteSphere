const cloudinary = require('../config/cloudinary');

// Validate Cloudinary config on load
const CLOUDINARY_CONFIGURED =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_KEY !== '1234567890' &&
  process.env.CLOUDINARY_API_SECRET !== '**********';

if (!CLOUDINARY_CONFIGURED) {
  console.warn(
    '[Cloudinary] WARNING: Cloudinary is NOT fully configured. ' +
    'Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET ' +
    'in your environment variables. Image uploads will use mock fallback.'
  );
}

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {String} folder - Target folder in Cloudinary
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadImageBuffer = async (buffer, folder = 'wastesphere') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are missing or placeholders, use mock fallback
    if (!CLOUDINARY_CONFIGURED) {
      console.warn('[Cloudinary] Using mock fallback — no valid credentials configured.');
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return resolve({
        url: `https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80`,
        public_id: mockId,
      });
    }

    console.log(`[Cloudinary] Uploading to folder: ${folder} (cloud: ${process.env.CLOUDINARY_CLOUD_NAME})`);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', {
            message: error.message,
            http_code: error.http_code,
            name: error.name,
          });
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        console.log(`[Cloudinary] Upload success: ${result.public_id}`);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} public_id
 */
const deleteImage = async (public_id) => {
  if (!public_id || public_id.startsWith('mock_')) return true;
  try {
    await cloudinary.uploader.destroy(public_id);
    return true;
  } catch (error) {
    console.error('[Cloudinary] Destroy error:', error.message);
    return false;
  }
};

module.exports = {
  uploadImageBuffer,
  deleteImage,
};

