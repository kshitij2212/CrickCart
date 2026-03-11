const express = require("express");
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { 
  uploadImages, 
  createCategory, 
  getAllCategories, 
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

router.post("/upload", upload.array('images'), uploadImages);
router.post("/create", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;