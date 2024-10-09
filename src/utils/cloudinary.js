import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name:process.env.CLOUD_NAME , 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

const fileUploadOnCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) return null
        else{
            const result = await cloudinary.uploader.upload(localfilepath,{
                resource_type : "auto"
            })
        }
    } catch (error) {
        fs.unlinkSync(localfilepath)  // remove locally saved temporary file as the upload operation got failed.
    }
}

export default fileUploadOnCloudinary