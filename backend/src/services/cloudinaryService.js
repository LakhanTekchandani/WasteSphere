const cloudinary = require('../config/cloudinary');

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image file buffer
 * @param {String} folder - Target folder in Cloudinary
 * @returns {Promise<{url: string, public_id: string}>}
 */
const uploadImageBuffer = async (buffer, folder = 'wastesphere') => {
  return new Promise((resolve, reject) => {
    // If Cloudinary keys are standard placeholders, return a simulated clean URL for offline/hackathon testing
    if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === '1234567890') {
      const mockId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const base64Data = buffer.toString('base64');
      const mockUrl = `data:image/jpeg;base64,${base64Data.substring(0, 100)}...`; // Or mock placeholder URL
      return resolve({
        url: `https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80`,
        public_id: mockId,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
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
    console.error('Cloudinary destroy error:', error.message);
    return false;
  }
};

module.exports = {
  uploadImageBuffer,
  deleteImage,
};
