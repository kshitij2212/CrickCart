const Brand = require('../models/Brand');

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            })}

        res.status(200).json({
            success: true,
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


exports.getBrandBySlug = async (req, res) => {
    try {
        const brand = await Brand.findOne({ slug: req.params.slug });

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        res.status(200).json({
            success: true,
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


exports.createBrand = async (req, res) => {
    try {
        const { name, slug, logo } = req.body;
        const brandExists = await Brand.findOne({ name });
        if (brandExists) {
            return res.status(400).json({
                success: false,
                message: 'Brand with this name already exists'
            });
        }

        const brand = await Brand.create({
            name,
            slug,
            logo
        });

        res.status(201).json({
            success: true,
            message: 'Brand created successfully',
            data: brand
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Brand with this name or slug already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};



exports.updateBrand = async (req, res) => {
    try {
        const { name, slug, logo } = req.body;

        let brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'})}

        if (name !== brand.name) {
            const nameExists = await Brand.findOne({ 
                name, 
                _id: { $ne: req.params.id } 
            });
            if (nameExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Brand with this name already exists'
                });
            }
        }

        brand = await Brand.findByIdAndUpdate(
            req.params.id,
            { name, slug, logo },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Brand updated successfully',
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};


exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found'
            });
        }

        const Product = require('../models/Product');
        const productsWithBrand = await Product.countDocuments({ brand: req.params.id });

        if (productsWithBrand > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete brand. ${productsWithBrand} product(s) are using this brand.`
            });
        }

        await brand.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Brand deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};