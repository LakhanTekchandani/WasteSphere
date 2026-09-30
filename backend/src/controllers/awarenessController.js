const AwarenessContent = require('../models/AwarenessContent');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * List awareness content articles
 * GET /api/awareness
 */
const getAwarenessContent = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const articles = await AwarenessContent.find(filter).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Awareness content articles retrieved.', { articles });
  } catch (error) {
    next(error);
  }
};

/**
 * Get article by ID
 * GET /api/awareness/:id
 */
const getAwarenessById = async (req, res, next) => {
  try {
    const article = await AwarenessContent.findById(req.params.id);
    if (!article) {
      return errorResponse(res, 404, 'Awareness content article not found.');
    }
    return successResponse(res, 200, 'Awareness article retrieved.', { article });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Create awareness content
 * POST /api/awareness
 */
const createAwarenessAdmin = async (req, res, next) => {
  try {
    const { title, category, content, summary, imageUrl } = req.body;

    if (!title || !category || !content) {
      return errorResponse(res, 400, 'Title, category, and content are required.');
    }

    const article = await AwarenessContent.create({
      title,
      category,
      content,
      summary: summary || '',
      imageUrl: imageUrl || '',
      createdBy: req.user._id,
    });

    return successResponse(res, 201, 'Awareness content created successfully.', { article });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Update awareness content
 * PUT /api/awareness/:id
 */
const updateAwarenessAdmin = async (req, res, next) => {
  try {
    const { title, category, content, summary, imageUrl, isActive } = req.body;
    const article = await AwarenessContent.findById(req.params.id);

    if (!article) {
      return errorResponse(res, 404, 'Awareness content article not found.');
    }

    if (title) article.title = title;
    if (category) article.category = category;
    if (content) article.content = content;
    if (summary !== undefined) article.summary = summary;
    if (imageUrl !== undefined) article.imageUrl = imageUrl;
    if (isActive !== undefined) article.isActive = isActive;

    await article.save();

    return successResponse(res, 200, 'Awareness content updated successfully.', { article });
  } catch (error) {
    next(error);
  }
};

/**
 * Approved Admin: Delete awareness content
 * DELETE /api/awareness/:id
 */
const deleteAwarenessAdmin = async (req, res, next) => {
  try {
    const article = await AwarenessContent.findByIdAndDelete(req.params.id);
    if (!article) {
      return errorResponse(res, 404, 'Awareness content article not found.');
    }
    return successResponse(res, 200, 'Awareness content deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAwarenessContent,
  getAwarenessById,
  createAwarenessAdmin,
  updateAwarenessAdmin,
  deleteAwarenessAdmin,
};
