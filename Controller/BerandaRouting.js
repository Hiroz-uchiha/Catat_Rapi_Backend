const express = require("express")
const gambarSchema = require("../Schema/GambarSchema")
const todolistSchema = require("../Schema/TodolistSchema")
const rute = express.Router()
const verifyToken = require("./Authorization/jwt");


rute.get("/",verifyToken,async(req,res) => {
    try{
        console.log("User ID : ", req.user ? req.user._id : "User not found")

        const userId = req.user ? req.user._id : null;

        // Ambil semua gambar dan todolist dari user
        const gambar = await gambarSchema.find().lean();
        const todolist = await todolistSchema.find({createdBy:userId}).lean();

        console.log("Gambar : ", gambar)
        console.log("Todolist : ", todolist)
        // Gabungkan 2 array
        const berandaData = [...gambar, ...todolist];

        // Urutkan berdasarkan createdAt
        // berandaData.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt) )
        res.status(200).json(berandaData)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = rute