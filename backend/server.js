const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

dotenv.config();

const app = express();

const frontendPath = path.join(__dirname, "../frontend");
const frontendDistPath = path.join(frontendPath, "dist");

// Auto create frontend dist if missing
if (!fs.existsSync(frontendDistPath)) {
  console.log("⚠️ frontend/dist not found. Building frontend...");

  try {
    execSync("npm install", {
      cwd: frontendPath,
      stdio: "inherit",
    });

    execSync("npm run build", {
      cwd: frontendPath,
      stdio: "inherit",
    });

    console.log("✅ Frontend build created successfully");
  } catch (error) {
    console.error("❌ Frontend build failed:", error.message);
  }
}

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// Serve React frontend
app.use(express.static(frontendDistPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });