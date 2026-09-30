const { recognizeWasteType } = require('../services/aiService');
const { uploadImageBuffer } = require('../services/cloudinaryService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * AI Waste Recognition API
 * POST /api/ai/waste-recognition
 * Accepts photo via file upload or imageUrl/base64Image in body
 */
const analyzeWasteImage = async (req, res, next) => {
  try {
    let imageBuffer = null;
    let imageUrl = req.body.imageUrl || null;
    let base64Image = req.body.base64Image || null;
    let mimeType = req.body.mimeType || 'image/jpeg';
    let cloudinaryResult = null;

    // If file uploaded via Multer
    if (req.file) {
      imageBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
      // Upload to Cloudinary to provide hosted URL if needed
      try {
        cloudinaryResult = await uploadImageBuffer(imageBuffer, 'wastesphere/reports');
        imageUrl = cloudinaryResult.url;
      } catch (e) {
        console.warn('Cloudinary upload warning during AI recognition:', e.message);
      }
    }

    if (!imageBuffer && !imageUrl && !base64Image) {
      return errorResponse(
        res,
        400,
        'Please upload an image file or provide an imageUrl/base64Image.'
      );
    }

    const aiResult = await recognizeWasteType({
      imageBuffer,
      imageUrl,
      base64Image,
      mimeType,
    });

    return successResponse(res, 200, 'Waste analysis complete. Suggestion generated.', {
      suggestedWasteType: aiResult.suggestedWasteType,
      confidence: aiResult.confidence,
      reasoning: aiResult.reasoning,
      providerUsed: aiResult.providerUsed,
      cloudinary: cloudinaryResult,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeWasteImage,
};
