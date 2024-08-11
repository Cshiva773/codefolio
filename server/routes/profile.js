import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.post('/user-profile', async (req, res) => {
  try {
    const { username, email, codingProfiles } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username,
        email,
        codingProfiles
      });
    } else {
      user.username = username;
      user.codingProfiles = {
        ...user.codingProfiles,
        ...codingProfiles
      };
    }

    await user.save();

    res.json({ message: 'Profile created/updated successfully', user });
  } catch (error) {
    console.error('Error in user profile operation:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Error in profile operation', error: error.message });
    }
  }
});

export default router;