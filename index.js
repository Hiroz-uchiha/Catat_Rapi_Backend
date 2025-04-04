require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Validate Environment Variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

const app = express();

// Enhanced CORS Configuration
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://catat-rapi-frontend.vercel.app' // Your production frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Preflight Handler
// app.options('*', cors(corsOptions));

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

// Route Imports
const TodolistRouting = require("./Controller/TodolistRouting");
const userRoutes = require("./Controller/Authorization/RegisterRouting");

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    status: "Backend is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      todo: "/todo",
      user: "/user"
    },
    cors: {
      allowedOrigins,
      status: "enabled"
    }
  });
});

// API Routes
app.use("/todo", TodolistRouting);
app.use("/user", userRoutes);

// Enhanced Error Handling
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: "CORS Policy Violation",
      message: "Your origin is not permitted",
      allowedOrigins,
      yourOrigin: req.get('origin') || 'undefined'
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Please try again later'
  });
});

// Server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed origins:`, allowedOrigins);
});

// Export for testing
module.exports = { app, server };