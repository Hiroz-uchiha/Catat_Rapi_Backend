const mongoose = require("mongoose")

const userSchema =  mongoose.Schema({
    username : {
        type : String, 
        required : true,
        max : 255
    },
    email : {
        type : String, 
        required : true,
        max : 100
    },
    password : {
        type : String, 
        required : true,
        min : 6,
        max : 1024
    },
    todolist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Todolist"
    }]
},
    {
        timestamps : true
    }
)

module.exports = mongoose.model("UserSchema",userSchema)