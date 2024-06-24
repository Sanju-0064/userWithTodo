const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isDeleted: { type: Boolean, default: false },
});

const ToDo = mongoose.model("todo", todoSchema);

module.exports = ToDo;
