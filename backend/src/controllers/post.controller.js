import {Post} from '../models/DiscussionPost.model.js';
import { User } from "../models/User.model.js";
import { validationResult } from 'express-validator';
import ApiResponse from '../utils/ApiResponse.js';

//req.params.is = post id
//req.user._id=user id

// Create a new post
export const createPost=async(req,res)=>{
    try{
        const {
            title,
            content,
            company,
            role,
            postType,
            domain,
            tags
        }=req.body

        const summary=content.substring(0,150)+ '...'
        const userId=req.user._id
        const formattedTags = Array.isArray(tags) ? tags.map(tag => tag.trim()) : [];
        const newPost=new Post({
            title,
            content,
            summary,
            userId,
            username:req.user.username,
            company,
            role,
            postType,
            domain,
            tags:formattedTags,
            rating: 0,
            status: 'active',
        })
        const savedPost=await newPost.save()
        res.status(201).json({
            success:true,
            data:savedPost
        })
    }    
    catch(error){
        console.log(error)
        return new ApiResponse(500, 'Error creating post', error)
    }
}

// Get all posts
export const getAllPosts=async(req,res)=>{
    try{
        const {page=1,limit=10,sort='-createdAt'}=req.query
        const posts=await Post.find()
        .populate('userId','username profilePicture')
        .sort(sort)
        .limit(limit*1)
        .skip((page-1)*limit)
        .exec()
        const count=await Post.countDocuments()
        res.status(200).json({
            success:true,
            data:posts,
            totalPages:Math.ceil(count/limit),
            currentPage:page
        })
    }
    catch(error){
        console.log(error)
        return new ApiResponse(500, 'Error getting posts', error)
    }
}

// Get filtered posts
export const getFilteredPosts = async (req, res) => {
    try {
      const { 
        sort = '-createdAt',
        page = 1, 
        limit = 10,
        postType,
        company,
        role,
        domain,
        search
      } = req.query;
      
      let query = {};
      
      // Add filters if provided
      if (postType && postType !== 'all') query.postType = postType;
      if (company && company !== 'all') query.company = company;
      if (role && role !== 'all') query.role = role;
      if (domain && domain !== 'all') query.domain = domain;
      
      // Add search functionality
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      // Handle different sort options
      let sortOption = {};
      switch(sort) {
        case 'oldest':
          sortOption = { createdAt: 1 };
          break;
        case 'most-viewed':
          sortOption = { views: -1 };
          break;
        case 'most-upvoted':
          sortOption = { upVotes: -1 };
          break;
        case 'most-recent':
        default:
          sortOption = { createdAt: -1 };
      }
      
      const posts = await Post.find(query)
        .populate('userId', 'username profilePicture')
        .sort(sortOption)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      
      const count = await Post.countDocuments(query);
      
      res.status(200).json({
        success: true,
        data: posts,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalPosts: count
      });
    } catch (error) {
      console.error("Error fetching filtered posts:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };


// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('userId', 'username profilePicture')
        .populate('comments.userId', 'username profilePicture')
        .populate('comments.replies.userId', 'username profilePicture');
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };

// Update a post
export const updatePost = async (req, res) => {
    try {
      const { title, content, company, role, postType, domain, tags } = req.body;
      
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      console.log("🔍 Post User ID:", post.userId.toString());
      console.log("🔍 Logged-in User ID:", req.user._id.toString());
      
      // Check if user is the owner of the post
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'User not authorized to update this post'
        });
      }
      
      // Generate a new summary if content is updated
      const summary = content && content.length > 150 
        ? content.substring(0, 150) + '...' 
        : (content || post.content);
      
      const formattedTags = Array.isArray(tags) ? tags.map(tag => tag.trim()) : [];

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          title: title || post.title,
          content: content || post.content,
          summary: summary,
          username:req.user.username,
          company: company || post.company,
          role: role || post.role,
          postType: postType || post.postType,
          domain: domain || post.domain,
          tags: formattedTags,
        },
        { new: true }
      );
      
      res.status(200).json({
        success: true,
        data: updatedPost
      });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  

// Delete a post
export const deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Check if user is the owner of the post
      if (post.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'User not authorized to delete this post'
        });
      }
      
      await Post.findByIdAndDelete(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  

// Upvote a post
export const upvotePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Check if user has already upvoted
      const upvoteIndex = post.upVotes.findIndex(id => id.toString() === req.user._0id);
      
      // Check if user has downvoted the post
      const downvoteIndex = post.downVotes.findIndex(id => id.toString() === req.user._id);
      
      if (upvoteIndex !== -1) {
        // User has already upvoted, remove the upvote
        post.upVotes.splice(upvoteIndex, 1);
      } else {
        // User has not upvoted, add the upvote
        post.upVotes.push(req.user._id);
        
        // If user had downvoted, remove the downvote
        if (downvoteIndex !== -1) {
          post.downVotes.splice(downvoteIndex, 1);
        }
      }
      
      await post.save();
      
      res.status(200).json({
        success: true,
        data: {
          upvotes: post.upVotes.length,
          downvotes: post.downVotes.length,
          upvoted: upvoteIndex === -1
        }
      });
    } catch (error) {
      console.error("Error upvoting post:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  
  // Downvote a post
  export const downvotePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Check if user has already downvoted
      const downvoteIndex = post.downVotes.findIndex(id => id.toString() === req.user._id.toString());
      
      // Check if user has upvoted the post
      const upvoteIndex = post.upVotes.findIndex(id => id.toString() === req.user._id.toString());
      
      if (downvoteIndex !== -1) {
        // User has already downvoted, remove the downvote
        post.downVotes.splice(downvoteIndex, 1);
      } else {
        // User has not downvoted, add the downvote
        post.downVotes.push(req.user._id);
        
        // If user had upvoted, remove the upvote
        if (upvoteIndex !== -1) {
          post.upVotes.splice(upvoteIndex, 1);
        }
      }
      
      await post.save();
      
      res.status(200).json({
        success: true,
        data: {
          upvotes: post.upVotes.length,
          downvotes: post.downVotes.length,
          downvoted: downvoteIndex === -1
        }
      });
    } catch (error) {
      console.error("Error downvoting post:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  
  // Add a comment to a post
  export const addComment = async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({
          success: false,
          message: 'Comment content is required'
        });
      }
      
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      const newComment = {
        userId: req.user._id,
        content,
        createdAt: new Date(),
        replies: []
      };
      
      post.comments.push(newComment);
      
      await post.save();
      
      // Populate user data for the new comment
      const populatedPost = await Post.findById(req.params.id)
        .populate('comments.userId', 'username profilePicture');
      
      const addedComment = populatedPost.comments[populatedPost.comments.length - 1];
      
      res.status(201).json({
        success: true,
        data: addedComment
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  
  // Get comments for a post
  export const getCommentsByPostId = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('comments.userId', 'username profilePicture')
        .populate('comments.replies.userId', 'username profilePicture')
        .select('comments');
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: post.comments
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
    
 
  
  // Bookmark a post
  export const bookmarkPost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      // Check if user has already bookmarked
      const bookmarkIndex = post.bookmarks.findIndex(id => id.toString() === req.user.id.toString());
      
      if (bookmarkIndex !== -1) {
        // User has already bookmarked, remove the bookmark
        post.bookmarks.splice(bookmarkIndex, 1);
      } else {
        // User has not bookmarked, add the bookmark
        post.bookmarks.push(req.user._id);
      }
      
      await post.save();
      
      res.status(200).json({
        success: true,
        data: {
          bookmarked: bookmarkIndex === -1,
          bookmarks: post.bookmarks.length
        }
      });
    } catch (error) {
      console.error("Error bookmarking post:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  
  // Increment view count
  export const incrementViews = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }
      
      post.views += 1;
      await post.save();
      
      res.status(200).json({
        success: true,
        data: {
          views: post.views
        }
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };