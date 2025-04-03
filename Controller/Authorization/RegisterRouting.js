const express = require("express")
const rute = express.Router()
const userSchema =  require("../../Schema/Authorization/UserSchema")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// const {registerValidation} = require("../../Schema/Authorization/RegiterValidation")

// Register
rute.post("/register", async(req,res) => {
    
    // Cek Email
    const emailExist = await userSchema.findOne({email : req.body.email})
    if(emailExist) return res.status(400).json({
        status : res.statusCode,
        message : "Email sudah ada"
    })
    
    //Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    
    const user = new userSchema({
        username : req.body.username,
        email : req.body.email,
        password : hashPassword
    })
    
    try{
        const saveUser = await user.save()
        res.json(saveUser)
    }catch(err){
        res.status(400).json({
            status : res.statusCode,
            message : "Gagal membuat user baru"
        })
    }
})


// Login
rute.post("/login", async(req,res) => {
    // Jika email ada
    const user = await userSchema.findOne({email : req.body.email})
    if(!user) return res.status(400).json({
        status : res.statusCode,
        message : "Email salah"
    })

    // Cek password
    const validPwd =  await bcrypt.compare(req.body.password, user.password)
    if(!validPwd) return res.status(400).json({
        status : res.statusCode,
        message : "Password anda salah"
    })

    // Membuat JWT Token
    const token = jwt.sign({_id : user._id}, process.env.SECRET_KEY)
    res.header("nama-token",token).json({
        token : token
    })

})

module.exports = rute;