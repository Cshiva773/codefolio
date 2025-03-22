// searchController.js
import {Post} from '../models/DiscussionPost.model.js';
import { User } from "../models/User.model.js";
import Company from '../models/Company.model.js';

// Search posts
export const searchPosts = async (req, res) => {
  try {
    const { q, type, company, role, domain, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    let query = {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };
    
    // Add filters if provided
    if (type && type !== 'all') query.postType = type;
    if (company && company !== 'all') query.company = company;
    if (role && role !== 'all') query.role = role;
    if (domain && domain !== 'all') query.domain = domain;
    
    const posts = await Post.find(query)
      .populate('userId', 'name profilePicture')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Post.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Advanced search with aggregation
export const advancedSearch = async (req, res) => {
  try {
    const { 
      q, 
      postType, 
      company, 
      role, 
      domain, 
      dateFrom, 
      dateTo,
      minUpvotes,
      minViews,
      sortBy = 'recent',
      page = 1, 
      limit = 10 
    } = req.query;
    
    let matchQuery = {};
    
    // Search text
    if (q) {
      matchQuery.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    // Add filters
    if (postType && postType !== 'all') matchQuery.postType = postType;
    if (company && company !== 'all') matchQuery.company = company;
    if (role && role !== 'all') matchQuery.role = role;
    if (domain && domain !== 'all') matchQuery.domain = domain;
    
    // Date range
    if (dateFrom || dateTo) {
      matchQuery.createdAt = {};
      if (dateFrom) matchQuery.createdAt.$gte = new Date(dateFrom);
      if (dateTo) matchQuery.createdAt.$lte = new Date(dateTo);
    }
    
    // Create aggregation pipeline
    const pipeline = [
      { $match: matchQuery },
      { 
        $addFields: { 
          upvoteCount: { $size: '$upVotes' },
          downvoteCount: { $size: '$downVotes' },
          commentCount: { $size: '$comments' }
        } 
      }
    ];
    
    // Additional filters
    if (minUpvotes) {
      pipeline.push({ $match: { upvoteCount: { $gte: parseInt(minUpvotes) } } });
    }
    
    if (minViews) {
      pipeline.push({ $match: { views: { $gte: parseInt(minViews) } } });
    }
    
    // Sorting
    switch (sortBy) {
      case 'recent':
        pipeline.push({ $sort: { createdAt: -1 } });
        break;
      case 'oldest':
        pipeline.push({ $sort: { createdAt: 1 } });
        break;
      case 'upvotes':
        pipeline.push({ $sort: { upvoteCount: -1 } });
        break;
      case 'views':
        pipeline.push({ $sort: { views: -1 } });
        break;
      case 'comments':
        pipeline.push({ $sort: { commentCount: -1 } });
        break;
      default:
        pipeline.push({ $sort: { createdAt: -1 } });
    }
    
    // Count total results
    const countPipeline = [...pipeline];
    const countResult = await Post.aggregate([...countPipeline, { $count: 'total' }]);
    const totalResults = countResult.length > 0 ? countResult[0].total : 0;
    
    // Add pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: parseInt(limit) });
    
    // Add user lookup
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    });
    
    pipeline.push({ $unwind: '$user' });
    
    // Project only needed fields
    pipeline.push({
      $project: {
        _id: 1,
        title: 1,
        summary: 1,
        content: 1,
        company: 1,
        role: 1,
        postType: 1,
        domain: 1,
        createdAt: 1,
        upvoteCount: 1,
        downvoteCount: 1,
        commentCount: 1,
        views: 1,
        tags: 1,
        user: {
          _id: '$user._id',
          name: '$user.name',
          profilePicture: '$user.profilePicture'
        }
      }
    });
    
    const results = await Post.aggregate(pipeline);
    
    res.status(200).json({
      success: true,
      data: results,
      totalPages: Math.ceil(totalResults / limit),
      currentPage: parseInt(page),
      totalResults
    });
  } catch (error) {
    console.error('Error in advanced search:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Suggest tags
export const suggestTags = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required'
      });
    }
    
    // Find most used tags matching the query
    const tagResults = await Post.aggregate([
      { $unwind: '$tags' },
      { $match: { tags: { $regex: q, $options: 'i' } } },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, tag: '$_id', count: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: tagResults
    });
  } catch (error) {
    console.error('Error suggesting tags:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};