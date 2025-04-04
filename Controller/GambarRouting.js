const express= require("express")
const multer = require("multer")
const GambarSchema = require("../Schema/GambarSchema")
const fs = require("fs")
const path = require("path")
const rute = express.Router();


const storage = multer.diskStorage({
    destination : "uploads/",
    filename : (req,file,cb) => cb(null, Date.now() + "-" + file.originalname)
})
const upload = multer({storage})


// Ambil semua gambar
rute.get("/", async(req,res) => {
    try{
        const images = await GambarSchema.find();
        res.status(200).json(images)
    }catch(err){
        res.status(500).json({err})
    }
})

//Upload Gambar
rute.post("/", upload.single("gambar"), async(req,res) => {
    if(!req.file) {
        return res.status(400).json({message : "Tidak ada data yang diupload"})
    }

    try{
        const newImage = await GambarSchema.create({
            filename : req.file.filename,
            url : `http://localhost:3001/uploads/${req.file.filename}`
        })
        res.status(201).json(newImage)
    }catch(err){
        res.status(500).json(err)
    }
})

// Hapus Gambar
rute.delete("/:id", async(req,res) => {
    try{
        const image = await GambarSchema.findById(req.params.id)
        if(!image) return res.status(404).json({message : "Gambar tidak ditemukan"})
        
        // Hapus File dari folder uploads
        const filePath = path.join(__dirname, "../uploads", image.filename)
        fs.unlinkSync(filePath)

        // Hapus dari databse
        await GambarSchema.deleteOne({_id : req.params.id})
        res.json({message : "Gambar terhapus"})

    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = rute