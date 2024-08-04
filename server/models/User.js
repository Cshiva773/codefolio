import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  codingProfiles: {
    leetcode: String,
    codechef: String,
    gfg: String,
    codeforces: String,
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;