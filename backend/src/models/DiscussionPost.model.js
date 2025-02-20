import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const replySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
});

const postSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  postType: { type: String, required: true },
  domain: { type: String, required: true },
  rating: { type: Number, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  upVotes: [{ type: Types.ObjectId, ref: 'User' }],
  downVotes: [{ type: Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tags: [String],
  comments: [commentSchema],
});

export const Reply = mongoose.model('Reply', replySchema);
export const Comment = mongoose.model('Comment', commentSchema);
export default mongoose.model('Post', postSchema);
