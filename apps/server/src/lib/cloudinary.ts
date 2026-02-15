import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, 
    api_key: process.env.CLOUDINARY_API_KEY!, 
    api_secret: process.env.CLOUDINARY_API_SECRET!,
    secure: true 
});

const uploadToCloudinary = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "talksy_media" },  
            (error, result) => {
                if (error) return reject(error);
                resolve(result as UploadApiResponse);
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);                  
    });
}

const extractPublicId = (url: string): string | null => {
    if (!url) return null;
    // This regex works even if the URL has complex paths or versions
    const parts = url.split('/');
    const folderIndex = parts.indexOf('talksy_media');
    
    // If folder is found, return "folder/filename", else just filename
    if (folderIndex !== -1) {
        const filename = parts[parts.length - 1]?.split('.')[0];
        return `talksy_media/${filename}`;
    }
    
    return parts[parts.length - 1]?.split('.')[0] || null;
};

const deleteFromCloudinary = async (publicId: string) => {
    try {
        if (!publicId) return null;
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        return null;
    }
};

export { uploadToCloudinary, deleteFromCloudinary, extractPublicId };