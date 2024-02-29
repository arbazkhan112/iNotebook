const mongoose = require("mongoose");

const usersSchema =  new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const usersModel = mongoose.model("users", usersSchema);
module.exports = usersModel;