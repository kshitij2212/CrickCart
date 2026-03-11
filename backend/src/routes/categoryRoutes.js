const express = require("express");
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadImages, createCategory, getAllCategories, getCategoryById } = require('../controllers/categoryController');

router.post("/upload", upload.array('images'), uploadImages);
router.post("/create", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

module.exports = router;
