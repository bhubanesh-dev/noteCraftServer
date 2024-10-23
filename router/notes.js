const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/Authenticate");
const Note = require("../models/Notes");

// ROUTE 1: Get All the Notes using: GET "/note/fetchnote". Login required

router.get("/note/fetchnote", authenticate, async (req, res) => {
  userId = req.verifyId;

  const notes = await Note.find({ user: userId });
  res.json(notes);
});

// ROUTE 2: Add a new Note using: POST "/api/auth/addnote". Login required
router.post("/note/addnote", authenticate, async (req, res) => {
  userId = req.verifyId;

  const { title, description, tag } = req.body;
  console.log(userId, req.body);

  if (!title || !description) {
    return res.status(422).send("Please enter all fields");
  } else if (title.length < 5) {
    return res.status(422).send("Title must be at least 5 characters long!");
  } else if (description.length < 8) {
    return res
      .status(422)
      .send("Description must be at least 8 characters long!");
  } else {
    try {
      const note = new Note({
        title,
        description,
        tag,
        user: userId,
      });
      const savedNote = await note.save();

      res.status(201).json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
});

// ROUTE 3: Update an existing Note using: PUT "/notes/updatenote". Login required
router.put("/note/updatenote", authenticate, async (req, res) => {
  const { title, description, tag } = req.body;
  console.log(req.body);
  // Create a newNote object
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

  // Find the note to be updated and update it
  const userId = await Note.findById(req.body._id);
  console.log("userid",userId._id);
  if (!userId) {
    return res.status(404).send("Not Found the note userID");
  }

  if (userId.user.toString() !== req.verifyId) {
    return res.status(401).send("Not Allowed");
  }

  const note = await Note.findByIdAndUpdate(
    req.body._id,
    { $set: newNote },
    { new: true }
  );
  res.status(200).json({ note });
});

// ROUTE 4: Delete an existing Note using: DELETE "/note/deletenote". Login required
router.delete("/note/deletenote", authenticate, async (req, res) => {
  try {
    userId = req.verifyId;
    // Find the note to be delete and delete it
    const info = await Note.findById(req.body._id);
    console.log(info);
    if (!info) {
      return res.status(404).send("Not Found");
    }

    // Allow deletion only if user owns this Note
    if (info.user.toString() !== req.verifyId) {
      return res.status(401).send("Not Allowed");
    }

    const note = await Note.findByIdAndDelete(req.body._id);
    res.status(200).json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
