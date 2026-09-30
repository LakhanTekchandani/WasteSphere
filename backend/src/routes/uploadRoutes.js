const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImageBuffer } = require('../services/cloudinaryService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Standalone Image Upload to Cloudinary
 * POST /api/upload/image
 */
router.post('/image', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'Image file is required.');
    }

    const folder = req.query.folder || 'wastesphere';
    const uploadRes = await uploadImageBuffer(req.file.buffer, folder);

    return successResponse(res, 200, 'Image uploaded successfully to Cloudinary.', {
      url: uploadRes.url,
      public_id: uploadRes.public_id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
