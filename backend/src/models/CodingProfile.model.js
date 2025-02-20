import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const codingProfileSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    categoryProgress: [{
      category: String,
      solved: { type: Number, default: 0 },
      totalAvailable: Number,
      lastSolved: Date,
      problemsSolved: [{
        problemId: String,
        platform: {
          type: String,
          enum: ['LeetCode', 'CodeForces', 'HackerRank', 'Others']
        },
        solvedDate: Date,
        difficulty: {
          type: String,
          enum: ['Easy', 'Medium', 'Hard']
        }
      }]
    }],
    activityCalendar: [{
      date: Date,
      activities: [{
        type: {
          type: String,
          enum: ['Coding', 'GitHub', 'Forum', 'Contest']
        },
        count: Number,
        details: mongoose.Schema.Types.Mixed
      }]
    }]
  }, { timestamps: true });
  
  
export const CodingProfile = mongoose.model('CodingProfile', codingProfileSchema);