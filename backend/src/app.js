const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require("./routes/orderRoutes")
const wishlistRoutes = require("./routes/wishlistRoutes")
const brandRoutes = require("./routes/brandRoutes")
const addressRoutes = require("./routes/addressRoutes")
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/cart", cartRoutes)
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/api/v1", (req, res) => {
  res.send("CrickCart is running...");
});

module.exports = app;