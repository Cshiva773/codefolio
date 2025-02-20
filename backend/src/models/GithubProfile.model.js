import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const githubProfileSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contributionCount: { type: Number, default: 0 },
    starsCount: { type: Number, default: 0 },
    activeDays: { type: Number, default: 0 },
    repositories: [{
      name: String,
      stars: Number,
      forks: Number,
      language: String
    }],
    lastSynced: Date,
    contributionCalendar: [{
      date: Date,
      count: Number
    }]
  }, { timestamps: true });

export const GitHubProfile = mongoose.model('GitHubProfile', githubProfileSchema);
