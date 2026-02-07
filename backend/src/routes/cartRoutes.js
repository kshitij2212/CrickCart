const express = require("express");
const router = express.Router();
const protect = require("../middlewares/userMiddleware")
const {
    getCart,
    addToCart
} = require("../controllers/cartControllers")

router.get("/",protect,getCart)
router.post("/add",protect,addToCart)

module.exports = router
