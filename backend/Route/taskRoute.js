const express=require("express");
const { createTask, getAllTask, updateTask, deleteTask, completed } = require("../Controllers/taskController");
const router=express.Router();
router.route("/getAll").get(getAllTask);
router.route("/new").post(createTask);
router.route("/completed/:id").put(completed);
router.route("/update/:id").put(updateTask);
router.route("/delete/:id").delete(deleteTask);
module.exports=router;