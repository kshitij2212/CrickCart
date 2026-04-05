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
      sort = "-createdAt",
      page = 1,
      limit = 12,
    } = req.query;

    const mongoose = require("mongoose");
    const Brand = require("../models/Brand");

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 12;
    const skip = (pageNumber - 1) * limitNumber;

    let query = {};

    console.log("REQ QUERY:", req.query);

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
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

        query.category = categoryDoc._id;
      }
    }

    if (brand) {
      if (mongoose.Types.ObjectId.isValid(brand)) {
        query.brand = brand;
      } else {
        const brandDoc = await Brand.findOne({
          $or: [
            { slug: brand },
            { name: { $regex: brand, $options: "i" } },
          ],
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

        query.brand = brandDoc._id;
      }
    }

    if (search && search.trim()) {
      const searchValue = search.trim();
      query.$or = [
        { name: { $regex: searchValue, $options: "i" } },
        { description: { $regex: searchValue, $options: "i" } },
      ];
    }

    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }

    console.log("FINAL QUERY:", JSON.stringify(query, null, 2));

    let allProducts = await Product.find(query)
      .populate("category", "name slug color")
      .populate("brand", "name slug logo")
      .sort(typeof sort === "string" ? sort : "-createdAt");

    console.log("ALL MATCHING PRODUCTS:", allProducts.length);

    if (minPrice || maxPrice) {
      allProducts = allProducts.filter((product) => {
        const finalPrice =
          product.discount && product.discount > 0
            ? product.price - (product.price * product.discount) / 100
            : product.price;

        if (minPrice && finalPrice < Number(minPrice)) return false;
        if (maxPrice && finalPrice > Number(maxPrice)) return false;

        return true;
      });
    }

    const totalFiltered = allProducts.length;
    const totalPages = Math.ceil(totalFiltered / limitNumber);

    const paginatedProducts = allProducts.slice(skip, skip + limitNumber);

    res.status(200).json({
      success: true,
      count: paginatedProducts.length,
      total: totalFiltered,
      totalPages,
      currentPage: pageNumber,
      data: paginatedProducts,
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
            .sort('-createdAt');

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

        product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
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