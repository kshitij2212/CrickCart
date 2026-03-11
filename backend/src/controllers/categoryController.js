const Category = require("../models/Category");
const slugify = require("slugify");
const { uploadImagesToCloudinary } = require('../utils/uploadHelper');

exports.uploadImages = async (req, res) => {
    try {
        const images = await uploadImagesToCloudinary(req.files, 'crickcart/categories');
        return res.status(200).json({
            success: true,
            message: "Images uploaded successfully",
            images
        });
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error uploading images",
            error: error.message
        })
    }
};

exports.createCategory = async (req, res) => {
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
};

exports.getAllCategories = async (req, res) => {
    try {
        const categoriesList = await Category.find();
        if (!categoriesList) {
            return res.status(404).json({
                success: false,
                message: "Categories not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categoriesList,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const {id} = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching category",
            error: error.message
        })
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (req.body.name) {
            req.body.slug = slugify(req.body.name);
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating category",
            error: error.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: error.message
        });
    }
};