const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');


//CRUD operations Routes

//Route 1: Get(Read) all the notes using => GET "/api/note/fetchAllnotes" logged in required so token required 
router.get('/fetchAllnotes', fetchuser, async (req, res) => {

    try {
        const note = await Note.find({ user: req.user.id });
        res.json({note});
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }



})

//Route 2 : Create a new note using => POST "/api/note/addNote"  Logged in required, so token must be sent
router.post('/addNote', fetchuser, [
    body('title', 'Title must be atleast 3 characters long').isLength({ min: 3 }), //validator checks
    body('description', 'Description must be atleast 8 characters long').isLength({ min: 8 }),

], async (req, res) => {



    //if there are errors send bad request, and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;

    try {
        const note = new Note({ title, description, tag, user: req.user.id });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }



})

//Route 3 : Update a note using => PuT "/api/note/updateNote"  Logged in required, so token must be sent
router.put('/updateNote/:id', fetchuser, [
    body('title', 'Title must be atleast 3 characters long').isLength({ min: 3 }), //validator checks
    body('description', 'Description must be atleast 8 characters long').isLength({ min: 8 }),

], async (req, res) => {

    //if there are errors send bad request, and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;
    try {



        const newNote = {};

        if (title) {
            newNote.title = title;

        }

        if (description) {
            newNote.description = description;

        }

        if (tag) {
            newNote.tag = tag;

        }
        var note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Invalid Note ID");

        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access Denied");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);



    } catch (error) {
        res.status(500).send("Internal Server Error");
    }

})


//Route 4 : delete a note using => DELETE "/api/note/deleteNote"  Logged in required, so token must be sent

router.delete('/deleteNote/:id', fetchuser,
 async (req, res) => {
 
  try {
    
   // find the node to be deleted and delete it.

    var note = await Note.findById(req.params.id);
    if(!note)
    {
        return res.status(404).send("Invalid Note ID");
    }


    //Check if the right user is deleting the note
    if(note.user.toString()!==req.user.id){
       return  res.status(401).send("Access Denied");
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({"Success": "Note has been deleted", "note":note});
    

  } catch (error) {
    res.status(500).send("Internal Server Error");
  }

})

module.exports = router;
