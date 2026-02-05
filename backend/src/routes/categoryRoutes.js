const express = require("express");
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadImages, createCategory, getAllCategories } = require('../controllers/categoryController');

router.post("/upload", upload.array('images'), uploadImages);
router.post("/create", createCategory);
router.get("/", getAllCategories);

module.exports = router;
