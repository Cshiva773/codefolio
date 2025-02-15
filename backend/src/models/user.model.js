import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minLength: 8
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    profilePicture:{
      type:String,
      required:true,
    },
    profileInfo: {
      batchYear: Number,
      collegeName: String,
      profilePicture: String,
      bio: String,
      location: String,
      joinedDate: { type: Date, default: Date.now }
    },
    socialLinks: {
      portfolio: String,
      linkedin: String,
      leetcode: {
        username: String,
        profile: String
      },
      github: {
        username: String,
        profile: String
      },
      resume: String
    },
    codingStats: {
      totalProblemsSolved: { type: Number, default: 0 },
      problemsByDifficulty: {
        easy: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        hard: { type: Number, default: 0 }
      },
      rank: Number,
      contestRating: {
        current:Number,
        maxRank:Number
      },
      totalContests: { type: Number, default: 0 },
      profileViews: { type: Number, default: 0 },
      totalActiveDays: { type: Number, default: 0 },
      streakCount: { type: Number, default: 0 },
      lastSubmission: Date
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: true },
      theme: { type: String, default: 'light' },
      language: { type: String, default: 'en' }
    }
  }, { timestamps: true });
  
  userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  });
export const User=mongoose.model("User",userSchema);