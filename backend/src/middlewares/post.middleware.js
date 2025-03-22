import { body, param, query } from 'express-validator';

export const validateCreatePost = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  
  body('content')
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  
  body('company')
    .notEmpty().withMessage('Company name is required'),
  
  body('role')
    .notEmpty().withMessage('Position/Role is required'),
  
  body('postType')
    .notEmpty().withMessage('Post type is required')
    .isIn(['interview experience', 'discussion', 'doubt', 'others'])
    .withMessage('Invalid post type'),
  
  body('domain')
    .notEmpty().withMessage('Industry domain is required'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .custom((value) => {
      if (Array.isArray(value) && value.length > 10) {
        throw new Error('Maximum 10 tags allowed');
      }
      return true;
    }),
];

export const validateUpdatePost = [
  param('id').isMongoId().withMessage('Invalid post ID'),
  
  body('title')
    .optional()
    .isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  
  body('content')
    .optional()
    .isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  
  body('postType')
    .optional()
    .isIn(['interview experience', 'discussion', 'doubt', 'others'])
    .withMessage('Invalid post type'),
];

export const validateFilterParams = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  
  query('sort')
    .optional()
    .isIn(['most-recent', 'oldest', 'most-viewed', 'most-upvoted'])
    .withMessage('Invalid sort option'),
  
  query('postType')
    .optional()
    .isIn(['all', 'interview experience', 'discussion', 'doubt', 'others'])
    .withMessage('Invalid post type filter'),
];

export const validateComment = [
  param('id').isMongoId().withMessage('Invalid post ID'),
  
  body('content')
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters'),
];

export const validateReply = [
  param('postId').isMongoId().withMessage('Invalid post ID'),
  param('commentId').isMongoId().withMessage('Invalid comment ID'),
  
  body('content')
    .notEmpty().withMessage('Reply content is required')
    .isLength({ min: 1, max: 500 }).withMessage('Reply must be between 1 and 500 characters'),
];