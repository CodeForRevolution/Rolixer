const express=require("express");
// const { createTask, getAllTask, updateTask, deleteTask, completed } = require("../Controllers/taskController");
const { getAllTransaction, statics, price, CategoryCount } = require("../Controllers/transactionController");
const router=express.Router();
router.route("/getAll").get(getAllTransaction);
router.route("/statics").get(statics);
router.route("/price").get(price);
router.route("/category").get(CategoryCount);

// router.route("/update/:id").put(updateTask);
// router.route("/delete/:id").delete(deleteTask);
module.exports=router;