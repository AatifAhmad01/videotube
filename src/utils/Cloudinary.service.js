import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_API_SECRETKEY
});


const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: "auto",
                cloud_name: process.env.CLOUDINARY_CLOUDNAME,
                api_key: process.env.CLOUDINARY_APIKEY,
                api_secret: process.env.CLOUDINARY_API_SECRETKEY
            });

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.log(error)
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export default uploadCloudinary;


