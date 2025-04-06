import express from 'express';
import { 
  createPost, 
  getAllPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  upvotePost, 
  downvotePost, 
  addComment,
  getCommentsByPostId,
  bookmarkPost,
  incrementViews,
  getFilteredPosts
} from '../controllers/post.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateCreatePost, validateUpdatePost, validateComment, validateReply } from '../middlewares/post.middleware.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

//POST CRUD routes
router.post('/posts', verifyJWT, validateCreatePost, handleValidationErrors, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/filter', getFilteredPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', verifyJWT, validateUpdatePost, handleValidationErrors, updatePost);
router.delete('/posts/:id', verifyJWT, deletePost);

//Interaction routes
router.post('/posts/:id/upvote', verifyJWT, upvotePost);
router.post('/posts/:id/downvote', verifyJWT, downvotePost);
router.post('/posts/:id/views', incrementViews);
router.post('/posts/:id/bookmark', verifyJWT, bookmarkPost);

//Comment routes
router.post('/posts/:id/comments', verifyJWT, validateComment, handleValidationErrors, addComment);
router.get('/posts/:id/comments', getCommentsByPostId);

export default router;
