const mongoose = require("mongoose")

const gambarSchema =  new mongoose.Schema({
    filename : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required: true
    },
    // judul : {
    //     type : String,
    //     required : true
    // },
    // deskripsi : {
    //     type : String,
    //     required : true
    // },
    // bintang : {
    //     type : Number,
    //     default : 0
    // },
},
    {
        timestamps : true
    }
)

module.exports = mongoose.model("Gambar",gambarSchema)