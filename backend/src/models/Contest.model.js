import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const contestSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      score: { type: Number, default: 0 },
      rank: Number,
      submissions: [{
        problemId: String,
        submissionTime: Date,
        status: String,
        language: String,
        score: Number
      }]
    }],
    problems: [{
      id: String,
      title: String,
      difficulty: String,
      points: Number,
      categories: [String]
    }],
    status: {
      type: String,
      enum: ['Upcoming', 'Active', 'Completed'],
      default: 'Upcoming'
    }
  }, { timestamps: true });

export const Contest = mongoose.model('Contest', contestSchema);