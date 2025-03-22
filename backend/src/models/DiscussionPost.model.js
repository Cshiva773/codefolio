import mongoose, { Schema, Types } from 'mongoose';

const replySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  isEdited: { type: Boolean, default: false }
});

const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  isEdited: { type: Boolean, default: false },
  replies: [replySchema],
});

const postSchema = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  summary: { type: String, required: true, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username:{type:String,required:true},
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  postType: { 
    type: String, 
    required: true,
    enum: ['interview experience', 'discussion', 'doubt', 'others']
  },
  domain: { type: String, required: true },
  rating: { type: Number, default: 0 },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'inactive', 'reported', 'deleted'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  isEdited: { type: Boolean, default: false },
  upVotes: [{ type: Types.ObjectId, ref: 'User' }],
  downVotes: [{ type: Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  comments: [commentSchema],
  shares: { type: Number, default: 0 },
  lastActivityAt: { type: Date, default: Date.now }
});

// Create indexes for better performance
postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ company: 1 });
postSchema.index({ postType: 1 });
postSchema.index({ domain: 1 });
postSchema.index({ role: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ views: -1 });

// Update lastActivityAt pre-save
postSchema.pre('save', function(next) {
  // If this is an edit (not a new document)
  if (!this.isNew) {
    this.updatedAt = new Date();
    this.isEdited = true;
  }
  
  // Update last activity time
  this.lastActivityAt = new Date();
  next();
});

export const Reply = mongoose.model('Reply', replySchema);
export const Comment = mongoose.model('Comment', commentSchema);
export const Post = mongoose.model('Post', postSchema);