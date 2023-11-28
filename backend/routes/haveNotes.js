const express = require('express')
const router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator')

// ROUTE 1: Get all notes: GET'/api/notes/fetchallnotes'.Login required 
router.get('/fetchallnotes', fetchUser, async (req, resp) => {
    try {
        const notes = await Notes.find({ user1: req.user.id })//fetch all notes for user id passed
        resp.json(notes)
    } catch (error) {
        resp.status(500).send('Internal Server Error')
        console.error(error.message)
    }

})

// ROUTE 2: Add a new notes: POST'/api/notes/addnote'.Login required 
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, resp) => {
    try {
        const { title, description, tag } = req.body;
        //if there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ errors: errors.array() })
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await note.save()

        resp.json(savedNotes)
    } catch (error) {
        resp.status(500).send('Internal Server Error')
        console.error(error.message)
    }

})


//Route3: Update an existing Note using: PUT '/api.auth.updatenote'. Login required
router.put('/updatenote/:id', fetchUser, async (req, resp) => {
    const { title, description, tag } = req.body
    try {
        //create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Notes.findById(req.params.id)
        if (!note) {
            return resp.status(404).send('Not Found')
        }
        if (note.user.toString() !== req.user.id) {
            return resp.status(404).send('Not Allowed')
        }
        // Find the note to be updated and update it

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        resp.json({ note })
    } catch (error) {
        resp.status(500).send('Internal Server Error')
        console.error(error.message)
    }

})

//Route4: Delete an existing Note using: DELETE '/api.auth.deletenote'. Login required
router.delete('/deletenote/:id', fetchUser, async (req, resp) => {
    try {

        // Find the note to be updated and update it
        //check if its right user
        let note = await Notes.findById(req.params.id)//fetch the user
        if (!note) {
            return resp.status(404).send('Not Found')
        }
        //Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return resp.status(404).send('Not Allowed')
        }


        note = await Notes.findByIdAndDelete(req.params.id)
        resp.json({ 'Success': 'Note has been deleted', note: note })
    } catch (error) {
        resp.status(500).send('Internal Server Error')
        console.error(error.message)
    }

})

module.exports = router