const mongoose = require("mongoose");

const { Schema } = mongoose;
const NotesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: "General",
  },
  favorite: {
    type: Boolean,
    default: False,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  archive: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("notes", NotesSchema);
