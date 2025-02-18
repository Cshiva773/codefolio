import dotenv from 'dotenv'
dotenv.config()
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
 

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("Cloudinary Upload Error: No file path provided.");
            return null;
        }

        console.log("Uploading to Cloudinary:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("Cloudinary Upload Success:", response);

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Remove local file
        }

        return null;
    }
};




export {uploadOnCloudinary}