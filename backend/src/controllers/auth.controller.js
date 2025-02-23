import { User } from "../models/User.model.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({ username, email, password, fullName });
    await user.save();

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json({ message: "User registered", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const logout = (req, res) => {
  res.json({ message: "User logged out" });
};

export const refreshToken = (req, res) => {
  res.json({ message: "Token refreshed" });
};