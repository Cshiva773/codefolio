import express from 'express';
import { searchPosts, advancedSearch, suggestTags } from '../controllers/search.controller.js';

const router = express.Router();

// Basic search
router.get('/search', searchPosts);

// Advanced search
router.get('/search/advanced', advancedSearch);

// Tag suggestions
router.get('/tags/suggest', suggestTags);

export default router;