import { User } from "../models/User.model.js";
export const getCurrentUser = async (req, res) => {

  return res.status(200).json({message:"user found",user:req.user})
}
  
export const updateProfile = async (req, res) => {
  try {
    const {
      username,
      fullName,
      bio,
      batchYear,
      collegeName,
      location,
      portfolio,
      linkedin,
      leetcode,
      github,
      codeforces,
      resume
    } = req.body;
    
    // Find the current user first
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Build update object only with provided fields
    const updateData = {};
    
    // Basic fields
    if (username) updateData.username = username;
    if (fullName) updateData.fullName = fullName;
    
    // Profile info fields - maintain existing data
    const profileInfo = { ...currentUser.profileInfo };
    if (bio) profileInfo.bio = bio;
    if (batchYear) profileInfo.batchYear = batchYear;
    if (collegeName) profileInfo.collegeName = collegeName;
    if (location) profileInfo.location = location;
    updateData.profileInfo = profileInfo;
    
    // Social links - maintain existing data
    const socialLinks = { ...currentUser.socialLinks };
    if (portfolio) socialLinks.portfolio = portfolio;
    if (linkedin) socialLinks.linkedin = linkedin;
    if (leetcode) socialLinks.leetcode = leetcode;
    if (github) socialLinks.github = github;
    if (codeforces) socialLinks.codeforces = codeforces;
    if (resume) socialLinks.resume = resume;
    updateData.socialLinks = socialLinks;
    
    // Perform the update
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password -refreshToken");
    
    if (!user) {
      return res.status(500).json({ message: "Error updating profile" });
    }
    
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ 
      message: "Error updating profile", 
      error: error.message 
    });
  }
}