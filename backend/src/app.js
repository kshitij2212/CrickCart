const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes")
// const cartRoutes = require("./routes/cartRoutes")

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes)
// app.use("/api/v1/cart", cartRoutes)

app.get("/", (req, res) => {
  res.send("CrickCart is running...");
});

module.exports = app;