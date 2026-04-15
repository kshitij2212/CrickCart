const Product = require('../models/Product');
const Category = require('../models/Category');
const slugify = require('slugify');
const { uploadImagesToCloudinary } = require('../utils/uploadHelper');

exports.uploadImages = async (req, res) => {
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
};

exports.createProduct = async (req, res) => {
    try {
        const category = await Category.findById(req.body.category);
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Invalid Category"
            })}

        if (req.body.brand) {
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(req.body.brand)) {
                const Brand = require('../models/Brand');
                const brand = await Brand.findById(req.body.brand);
                if (!brand) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Brand"
                    });
                }
            }
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
            isFeatured: req.body.isFeatured,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
        }).save();

        await product.populate('category', 'name slug color');
        await product.populate('brand', 'name slug logo');

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
};

exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      featured,
    sort = "-updatedAt",
      page = 1,
      limit = 12,
    } = req.query;

    const mongoose = require("mongoose");
    const Brand = require("../models/Brand");

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 12;
        const skip = (pageNumber - 1) * limitNumber;

        let categoryId = undefined;
        if (category) {
            if (mongoose.Types.ObjectId.isValid(category)) {
                categoryId = new mongoose.Types.ObjectId(category);
            } else {
                const categoryDoc = await Category.findOne({ slug: category });
                if (!categoryDoc) {
                    return res.status(200).json({
                        success: true,
                        count: 0,
                        total: 0,
                        totalPages: 0,
                        currentPage: pageNumber,
                        data: [],
                    });
                }
                categoryId = categoryDoc._id;
            }
        }

        let brandId = undefined;
        if (brand) {
            if (mongoose.Types.ObjectId.isValid(brand)) {
                brandId = new mongoose.Types.ObjectId(brand);
            } else {
                const brandDoc = await Brand.findOne({
                    $or: [{ slug: brand }, { name: { $regex: brand, $options: "i" } }],
                });
                if (!brandDoc) {
                    return res.status(200).json({
                        success: true,
                        count: 0,
                        total: 0,
                        totalPages: 0,
                        currentPage: pageNumber,
                        data: [],
                    });
                }
                brandId = brandDoc._id;
            }
        }

        const match = {};
        if (categoryId) match.category = categoryId;
        if (brandId) match.brand = brandId;
        if (featured !== undefined) match.isFeatured = featured === "true";
        if (search && search.trim()) {
            const searchValue = search.trim();
            match.$or = [
                { name: { $regex: searchValue, $options: "i" } },
                { description: { $regex: searchValue, $options: "i" } },
            ];
        }

        const pipeline = [];
        if (Object.keys(match).length) pipeline.push({ $match: match });

        pipeline.push({
            $addFields: {
                finalPrice: {
                    $cond: [
                        { $gt: ["$discount", 0] },
                        { $subtract: ["$price", { $multiply: ["$price", { $divide: ["$discount", 100] }] }] },
                        "$price",
                    ],
                },
            },
        });

        const priceMatch = {};
        if (minPrice) priceMatch.$gte = Number(minPrice);
        if (maxPrice) priceMatch.$lte = Number(maxPrice);
        if (Object.keys(priceMatch).length) pipeline.push({ $match: { finalPrice: priceMatch } });

        pipeline.push(
            { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            { $lookup: { from: "brands", localField: "brand", foreignField: "_id", as: "brand" } },
            { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } }
        );

        pipeline.push({
            $project: {
                name: 1,
                slug: 1,
                description: 1,
                price: 1,
                discount: 1,
                images: 1,
                countInStock: 1,
                rating: 1,
                numReviews: 1,
                specifications: 1,
                isFeatured: 1,
                createdAt: 1,
                updatedAt: 1,
                finalPrice: 1,
                category: { name: "$category.name", slug: "$category.slug", color: "$category.color", _id: "$category._id" },
                brand: { name: "$brand.name", slug: "$brand.slug", logo: "$brand.logo", _id: "$brand._id" },
            },
        });

        if (typeof sort === "string" && sort.length) {
            const sortField = sort.startsWith("-") ? sort.substring(1) : sort;
            const sortOrder = sort.startsWith("-") ? -1 : 1;
            pipeline.push({ $sort: { [sortField]: sortOrder } });
        } else pipeline.push({ $sort: { updatedAt: -1 } });

        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: limitNumber }],
            },
        });

        const aggResult = await Product.aggregate(pipeline).exec();
        const metadata = aggResult[0].metadata[0] || { total: 0 };
        const totalFiltered = metadata.total || 0;
        const totalPages = Math.ceil(totalFiltered / limitNumber);
        const paginatedProducts = aggResult[0].data || [];

        const transform = (doc) => {
            const out = { ...doc };
            if (out._id) {
                out.id = out._id;
                delete out._id;
            }

            if (out.category && out.category._id) {
                out.category.id = out.category._id;
                delete out.category._id;
            }

            if (out.brand && out.brand._id) {
                out.brand.id = out.brand._id;
                delete out.brand._id;
            }

            return out;
        };

        const transformed = paginatedProducts.map(transform);

        res.status(200).json({
            success: true,
            count: transformed.length,
            total: totalFiltered,
            totalPages,
            currentPage: pageNumber,
            data: transformed,
        });
  } catch (error) {
    console.error("GET ALL PRODUCTS ERROR MESSAGE:", error.message);
    console.error("GET ALL PRODUCTS STACK:", error.stack);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true })
            .populate('category', 'name slug color')
            .populate('brand', 'name slug logo')
            .limit(10)
            .sort('-updatedAt');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug color')
            .populate('brand', 'name slug logo');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (req.body.category) {
            const category = await Category.findById(req.body.category);
            if (!category) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Category"
                });
            }
        }

        if (req.body.brand) {
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(req.body.brand)) {
                const Brand = require('../models/Brand');
                const brand = await Brand.findById(req.body.brand);
                if (!brand) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid Brand"
                    });
                }
            }
        }

        if (req.body.name && req.body.name !== product.name) {
            req.body.slug = slugify(req.body.name, { lower: true }) + '-' + Date.now();
        }

        Object.keys(req.body).forEach((key) => {
            product[key] = req.body[key];
        });

        await product.save();

        product = await Product.findById(product._id)
            .populate('category', 'name slug color')
            .populate('brand', 'name slug logo');

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};