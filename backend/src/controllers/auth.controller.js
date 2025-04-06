import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import dotenv from "dotenv";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }

  }
  catch (error) {
    throw new ApiError(500, "Error generating token", error);
  }
}



dotenv.config(); // Load environment variables

export const signup = async (req, res) => {
  try {    
    console.log(req.body);
    const { username, email, password, fullName } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required." });
  }
  
  if (!email) {
      return res.status(400).json({ message: "Email is required." });
  }
  
  if (!password) {
      return res.status(400).json({ message: "Password is required." });
  }
  
  if (!fullName) {
      return res.status(400).json({ message: "Full Name is required." });
  }
  
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      username: username.toLowerCase(),
      email,
      password,
      fullName,
      profileInfo: { profilePicture: "" },
    });

    await user.save();

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      return res.status(500).json({ message: "Error creating user" });
    }

    // ✅ Generate JWT Token with ACCESS_TOKEN_SECRET from .env
    const token = jwt.sign(
      { id: createdUser._id, email: createdUser.email }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    console.log("Generated Token:", token); // ✅ Debugging


    return res.status(201).json({ 
      message: "User registered", 
      user: createdUser,
      token  // ✅ Make sure token is included in response
    });
    

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly: true,
      secure: true
    }
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        { message: "User logged in", user: loggedInUser, accessToken, refreshToken }
      )
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const logout = async (req, res) => {
  try {
    // If you have a user, update their refresh token
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: undefined }
      }, { new: true });
    }
    
    // Clear cookies regardless
    const options = {
      httpOnly: true,
      secure: true
    };
    
    res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
  console.log(incomingRefreshToken)
  if (!incomingRefreshToken) {
    throw new ApiError(401, "no refresh token provided")
  }
  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new ApiError(404, "user not found")
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "invalid refresh token")
    }
    const options = {
      httpOnly: true,
      secure: true
    }
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, newRefreshToken }, "token refreshed"))
  } catch (error) {
    throw new ApiError(401, error?.message || "unauthorized request")

  }
}

export const changeCurrentPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  console.log(currentPassword,newPassword)
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Please provide current and new password")
  }
  const user = await User.findById(req.user._id)
  if (!user) {
    throw new ApiError(404, "User not found")
  }
  const isMatch = await user.verifyPassword(currentPassword)
  if (!isMatch) {
    throw new ApiError(400, "Invalid current password")
  }
  user.password = newPassword
  await user.save({ validateBeforeSave: false })
  return res
    .status(200)
    .json({ message: "Password changed successfully" })
}


export const updateProfilePicture = async (req, res) => {
  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
    return res.status(400).json({ message: "Please upload an avatar" })
  }
  const avatarResponse = await uploadOnCloudinary(avatarLocalPath)
  if (!avatarResponse) {
    return res.status(500).json({ message: "Error uploading avatar" })
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      "profileInfo.profilePicture": avatarResponse.url
    }
  },
    {
      new: true
    }
  ).select("-password -refreshToken")
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  return res.status(200).json({ message: "Profile picture updated", user })
}

