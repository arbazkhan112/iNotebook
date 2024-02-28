const mongoose = require("mongoose");

const notesSchema =  new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    date: {
        type: date,
        default: Date.now
    }
})

const notesModel = mongoose.model("users", notesSchema);

module.exports = notesModel;