// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { 
    uploadImages,
    createProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.post("/upload", upload.array('images'), uploadImages);
router.post("/create", createProduct);
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;