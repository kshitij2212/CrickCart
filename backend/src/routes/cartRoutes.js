const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/userMiddleware");  // ✅ Add curly braces
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cartControllers");

// All cart routes are protected
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/:itemId", protect, updateCartItem);
router.delete("/:itemId", protect, removeFromCart);
router.delete("/", protect, clearCart);

module.exports = router;
