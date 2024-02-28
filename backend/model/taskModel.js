const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter the task title"],
  },
  description: {
    type: String,
    require: [true, "Enter the task Description"],
  },
  dueDate: {
    type: Date,
  },
  category: {
    type: String,
    default: "Office",
    enum: [
      "Meeting",
      "Research",
      "Training",
      "Human Resources",
      "Documentation",
    ],
    require: [true, "Enter the task category"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ["Medium", "Low", "High"],
  },
  taskHolder: {
    type: String,
    require: [true, "Enter the task Holder name"],
  },
  completedDate: {
    type: Date,
  },
});
module.exports = mongoose.model("Task", taskSchema);
