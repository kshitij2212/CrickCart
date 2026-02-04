const Category = require("../models/Category");
const ImageUpload = require("../models/ImageUpload");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
        }
    }
})


router.post("/upload", upload.array('images'), async (req, res) => {
    const uploadedUrls = [];

    try {
        for (let i = 0; i < req.files.length; i++) {
            const options = {
                use_filename: true,
                unique_filename: true,
                overwrite: false,
                folder: 'crickcart/categories'
            }
            const result = await cloudinary.uploader.upload(req.files[i].path, options);
            uploadedUrls.push(result.secure_url);

            if (fs.existsSync(req.files[i].path)) {
                fs.unlinkSync(req.files[i].path);
            }
        }


        let image = new ImageUpload({
            images: uploadedUrls
        })
        await image.save()
        return res.status(200).json({
            success: true,
            message: "Images uploaded successfully",
            images: uploadedUrls,
        })
    } catch (error) {
        console.error(error);

        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error uploading images",
            error: error.message
        })
    }
})

router.post("/create", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            })
        }

        let catObj = {
            name: req.body.name,
            slug: slugify(req.body.name),
            parent: req.body.parent,
            color: req.body.color,
        }
        if (req.body.images && req.body.images.length > 0) {
            catObj.images = req.body.images;
        } else {
            return res.status(400).json({
                success: false,
                message: "Please upload images first"
            })
        }

        const category = await new Category(catObj).save();
        if (!category) {
            return res.status(400).json({
                message: "Category not created",
            })
        }

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        })

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error.message
        })
    }
})

// router.get("/all", async (req, res) => {
//     try {
//         const categoriesList = await Category.find()
//         if (!categoriesList) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Categories not found"
//             })
//         }
//         return res.status(200).json({
//             success: true,
//             message: "Categories fetched successfully",
//             data: categoriesList,
//         })
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching categories",
//             error: error.message
//         })
//     }
// })

module.exports = router;