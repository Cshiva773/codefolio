import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';


const generateAccessAndRefreshToken=async(userId)=>{
  try{
      const user=await User.findById(userId)
      const accessToken=user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()
      user.refreshToken=refreshToken
      await user.save({validateBeforeSave:false})
      return {accessToken,refreshToken}

  }
  catch(error){
    throw res.status(500).json({message:"Error generating token",error})
  }
}


export const signup = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if([fullName,email,username,password].some((field)=>field?.trim()==="")){
        throw res.status(400).json({message:"Please fill all fields"})
  }
    
    const existingUser =await User.findOne({
      $or:[{username},{email}]
  })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const avatarLocalPath=req.files?.avatar[0]?.path

    if(!avatarLocalPath){
      return res.status(400).json({message:"Please upload an avatar"})
    }

    const avatarResponse=await uploadOnCloudinary(avatarLocalPath)

    if(!avatarResponse){
      return res.status(500).json({message:"Error uploading avatar"})
    }

    const user = new User({
      username: username.toLowerCase(),
      email,
      password,
      fullName,
      profileInfo: { profilePicture: avatarResponse.url }, // Save avatar in profileInfo
    });
    await user.save();

    //const accessToken = user.generateAccessToken();
    //const refreshToken = user.generateRefreshToken();
    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
      return res.status(500).json({message:"Error creating user"})
    }
    return res.status(201).json({message:"User registered",user:createdUser});
    // res.status(201).json({ message: "User registered", accessToken, refreshToken });
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