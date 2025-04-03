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
    updateAt: {
        type: Date,
        default: Date.now
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "UserSchema"
    }
});

module.exports = mongoose.model("Todolist", todolistSchema);
