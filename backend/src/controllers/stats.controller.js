import {Post} from '../models/DiscussionPost.model.js';
import { User } from "../models/User.model.js";
import mongoose from "mongoose";


// Get forum statistics
export const getForumStats = async (req, res) => {
    try {
      const totalPosts = await Post.countDocuments();
      const totalUsers = await User.countDocuments();
      
      // Get posts by type
      const postTypeStats = await Post.aggregate([
        {
          $group: {
            _id: '$postType',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);
      
      // Get top companies
      const companyStats = await Post.aggregate([
        {
          $group: {
            _id: '$company',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);
      
      // Get top domains/industries
      const domainStats = await Post.aggregate([
        {
          $group: {
            _id: '$domain',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);
      
      // Get most viewed posts
      const mostViewedPosts = await Post.find()
        .select('title company role views upVotes downVotes')
        .sort('-views')
        .limit(5);
      
      // Get most upvoted posts
      const mostUpvotedPosts = await Post.aggregate([
        {
          $addFields: {
            upvoteCount: { $size: '$upVotes' }
          }
        },
        {
          $sort: { upvoteCount: -1 }
        },
        {
          $limit: 5
        },
        {
          $project: {
            title: 1,
            company: 1,
            role: 1,
            upvoteCount: 1,
            views: 1
          }
        }
      ]);
      
      // Get most active users
      const mostActiveUsers = await Post.aggregate([
        {
          $group: {
            _id: '$userId',
            postCount: { $sum: 1 }
          }
        },
        {
          $sort: { postCount: -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $unwind: '$userInfo'
        },
        {
          $project: {
            _id: 1,
            name: '$userInfo.name',
            profilePicture: '$userInfo.profilePicture',
            postCount: 1
          }
        }
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          totalPosts,
          totalUsers,
          postTypeStats,
          companyStats,
          domainStats,
          mostViewedPosts,
          mostUpvotedPosts,
          mostActiveUsers
        }
      });
    } catch (error) {
      console.error('Error fetching forum stats:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  
  // Get user activity stats


export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // ✅ Ensure userId is converted properly to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // ✅ Get user post count
        const postCount = await Post.countDocuments({ userId });

        // ✅ Get user posts by type
        const postsByType = await Post.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: "$postType", count: { $sum: 1 } } }
        ]);

        // ✅ Get total upvotes, downvotes, and views
        const userPosts = await Post.find({ userId });
        let totalUpvotes = 0, totalDownvotes = 0, totalViews = 0;
        userPosts.forEach(post => {
            totalUpvotes += post.upVotes.length;
            totalDownvotes += post.downVotes.length;
            totalViews += post.views;
        });

        // ✅ Get bookmarked posts
        const bookmarkedPosts = await Post.find({ bookmarks: userObjectId })
            .select("title company role createdAt")
            .sort("-createdAt");

        // ✅ Get comment count
        const commentCounts = await Post.aggregate([
            { $match: { "comments.userId": userObjectId } },
            {
                $project: {
                    commentCount: {
                        $size: {
                            $filter: {
                                input: "$comments",
                                as: "comment",
                                cond: { $eq: ["$$comment.userId", userObjectId] }
                            }
                        }
                    }
                }
            },
            { $group: { _id: null, total: { $sum: "$commentCount" } } }
        ]);

        const totalComments = commentCounts.length > 0 ? commentCounts[0].total : 0;

        res.status(200).json({
            success: true,
            data: {
                postCount,
                postsByType,
                totalUpvotes,
                totalDownvotes,
                totalViews,
                totalComments,
                bookmarkedPosts: bookmarkedPosts.length,
                bookmarkedPostsList: bookmarkedPosts
            }
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
