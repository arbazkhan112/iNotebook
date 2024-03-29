const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser");
const notesModel = require("../models/Notes");

//ROUTE 1: Get all the notes using GET "/api/notes/fetchallnotes". Login Required.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await notesModel.find({ user: req.user.id });
        res.send(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//ROUTE 2: Add a new Note using GET "/api/notes/addnote". Login Required.
router.post("/addnote", fetchuser, [
    body('title').notEmpty().isLength({ min: 3 }),
    body('description').notEmpty().isLength({ min: 5 }),
], async (req, res) => {

    //Checking Errors for Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;

    try {
        const note = new notesModel({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await note.save();

        res.send(savedNotes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 3: Update Note using PUT "/api/notes/addnote". Login Required.
router.put("/updatenote/:id", fetchuser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;

        let newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await notesModel.findById(req.params.id);
        if (!note) { return res.status(404).send("Note Not Found") };

        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Available") };

        note = await notesModel.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

//ROUTE 4: Delete Note using DELETE "/api/notes/deletenote". Login Required.
router.delete("/deletenote/:id", fetchuser, async (req, res) => {

    try {

        let note = await notesModel.findById(req.params.id);
        if (!note) { return res.status(404).send("Note Not Found") };

        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") };

        note = await notesModel.findByIdAndDelete(req.params.id)
        res.json({success: "Note has been deleted", note: note});


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})


module.exports = router; 