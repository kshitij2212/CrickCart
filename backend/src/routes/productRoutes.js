const Product = require('../models/Product');
const Category = require('../models/Category');
const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const upload = require('../middlewares/uploadMiddleware');
const { uploadImagesToCloudinary } = require('../utils/uploadHelper');

router.post("/upload", upload.array('images'), async (req, res) => {
    try {
        const images = await uploadImagesToCloudinary(req.files, 'crickcart/products');
        return res.status(200).json({
            success: true,
            message: "Images uploaded successfully",
            images
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading images",
            error: error.message
        });
    }
});

router.post("/create", async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Invalid Category"
            });
        }

        if (!req.body.images || req.body.images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload images first"
            });
        }

        const product = await new Product({
            name: req.body.name,
            slug: slugify(req.body.name),
            description: req.body.description,
            brand: req.body.brand,
            price: req.body.price,
            discount: req.body.discount,
            category: req.body.category,
            images: req.body.images,
            countInStock: req.body.countInStock,
            specifications: req.body.specifications,
            isFeatured: req.body.isFeatured
        }).save();

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const {
            category,
            brand,
            minPrice,
            maxPrice,
            search,
            featured,
            sort = '-createdAt',
            page = 1,
            limit = 12
        } = req.query;

        let query = {};

        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }
        if (featured) query.isFeatured = featured === 'true';

        const products = await Product.find(query)
            .populate('category', 'name slug color')
            .sort(sort)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const count = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            data: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});



module.exports = router;