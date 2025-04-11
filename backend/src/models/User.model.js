//User.model.js

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
    isAdmin:{
      type:Boolean,
      default:false
    },
    isEmailVerified:{
      type:Boolean,
      default:false
    },
    fullName: {
      type: String,
      trim: true
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
      leetcode: String,
      codeforces: String,
      github: String,
      resume: String
    },
    energyPoints: {
      total: { type: Number, default: 0 },
      breakdown: {
        problemsSolving: { type: Number, default: 0 },
        contestParticipation: { type: Number, default: 0 },
        forumContributions: { type: Number, default: 0 },
        githubActivity: { type: Number, default: 0 }
      }
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
      lastSubmission: Date,
      languageStats: {
        type: Map,
        of: {
          problemsSolved: Number,
          lastUsed: Date
        },
        default: new Map()
      }
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      publicProfile: { type: Boolean, default: true },
      theme: { type: String, default: 'light' },
      language: { type: String, default: 'en' }
    },
    refreshToken:{
      type:String,
  },
  }, { timestamps: true });
  
  userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  });
  userSchema.methods.verifyPassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }) 
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const User=mongoose.model("User",userSchema);