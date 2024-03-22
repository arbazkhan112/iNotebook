const mongoose = require("mongoose");

const notesSchema =  new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
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
        type: Date,
        default: Date.now
    }
})

const notesModel = mongoose.model("notes", notesSchema);

module.exports = notesModel;