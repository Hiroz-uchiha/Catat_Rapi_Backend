require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose")
const mongoString = process.env.DATABASE_URL
const app = express();
const cors = require("cors")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
const TodolistRouting = require("./Controller/TodolistRouting")
// const GambarRouting = require("./Controller/GambarRouting")
const BerandaRouting = require("./Controller/BerandaRouting")

const path = require("path")

// Authorization
const userRoutes = require("./Controller/Authorization/RegisterRouting")

mongoose.connect(mongoString);
const db = mongoose.connection;

app.get('/', (req, res) => {
    res.json({ message: 'API Sederhana dengan Express.js yang di-deploy di Vercel!' });
  });
  
  // Route 
  
db.once("connnected",() => {
    console.log("Database Connected");
})

db.on("error",(err) => {
    console.log(err)
})

app.use("/todo", TodolistRouting);
app.use("/beranda", BerandaRouting);
// app.use("/uploads", express.static(path.join(__dirname,"uploads")))
// app.use("/images",GambarRouting)
app.use("/user",userRoutes)

module.exports = app