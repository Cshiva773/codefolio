import mongoose,{Schema} from 'mongoose'
const sheetSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    isPublic: { type: Boolean, default: true },
    problems: [{
      platform: String,
      problemId: String,
      title: String,
      difficulty: String,
      topic: String,
      status: { type: String, enum: ['Todo', 'In Progress', 'Done'] },
      notes: String
    }],
    topics: [String],
    collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  });

export const Sheet=mongoose.model('Sheet', sheetSchema); 