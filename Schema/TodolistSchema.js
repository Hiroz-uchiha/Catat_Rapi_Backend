const mongoose = require("mongoose");

const todolistSchema = new mongoose.Schema({
    isi: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserSchema"
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Todolist", todolistSchema);
