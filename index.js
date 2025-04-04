require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Validasi Environment Variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL tidak ditemukan di .env");
}

const app = express();

// Enhanced CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://catat-rapi-frontend.vercel.app'
];

// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Database Connected");
  } catch (err) {
    console.error("Database Connection Error:", err);
    process.exit(1);
  }
}
connectDB();

// Routes
const TodolistRouting = require("./Controller/TodolistRouting");
const userRoutes = require("./Controller/Authorization/RegisterRouting");

// Root Route
app.get("/", (req, res) => {
  res.json({
    status: "Backend is running",
    message: "Selamat datang di Catat Rapi API",
    available_endpoints: {
      todo: "/todo",
      user: "/user"
    },
    cors: {
      allowed_origins: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH', 'DELETE']
    }
  });
});

// Mount Routes
app.use("/todo", TodolistRouting);
app.use("/user", userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'Akses ditolak',
      allowed_origins: allowedOrigins 
    });
  }
  
  res.status(500).json({ 
    error: 'Terjadi kesalahan server',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Silakan coba lagi nanti'
  });
});

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log('Allowed Origins:', allowedOrigins);
});

module.exports = app;