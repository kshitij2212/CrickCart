const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const ImageUpload = require('../models/ImageUpload');

async function uploadImagesToCloudinary(files, folder) {
    const uploadedUrls = [];
    
    try {
        for (let file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                use_filename: true,
                unique_filename: true,
                overwrite: false,
                folder: folder
            });
            uploadedUrls.push(result.secure_url);
            
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }
        
        await new ImageUpload({ images: uploadedUrls }).save();
        return uploadedUrls;
        
    } catch (error) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
        throw error;
    }
}

module.exports = { uploadImagesToCloudinary };