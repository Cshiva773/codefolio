// statsRoutes.js
import express from 'express';
import { getForumStats, getUserStats } from '../controllers/stats.controller.js';
import { verifyJWT, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Get forum statistics (accessible to all)
router.get('/stats/forum', getForumStats);

// Get user activity statistics (requires authentication)
router.get('/stats/user', verifyJWT, getUserStats);

export default router;