import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = async(req, res, next) => {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Check if decoded token has user ID
    if (!decoded._id && !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }
    
    // Support both _id and id properties in the token
    const userId = decoded._id || decoded.id;
    
    // Find user in database
    const user = await User.findById(userId).select("-password -refreshToken");
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    
    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Add a new endpoint to verify token validity
export const verifyTokenEndpoint = (req, res) => {
  try {
    // If this point is reached, the token is valid (verifyJWT middleware already ran)
    return res.status(200).json({ 
      valid: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required'
    });
  }
};