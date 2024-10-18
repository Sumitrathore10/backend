import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

export const fileUploadOnCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;

        const result = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto",
        });

        // Cleanup: delete the local file after upload
        fs.unlinkSync(localfilepath); // remove the local temporary file

        return result; // return the result of the upload
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        
        // Remove the local file if upload fails
        if (fs.existsSync(localfilepath)) {
            fs.unlinkSync(localfilepath); // remove locally saved temporary file as the upload operation got failed.
        }

        return null; // return null on error
    }
};
