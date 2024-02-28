const Transaction = require("../model/transaction");
const Task=require("../model/taskModel");
const ErrorHandler = require("../utils/Errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const mongoose = require("mongoose");

exports.getAllTask = catchAsyncError(async (req, res, next) => {
  const {
    page = 1,
    pageSize = 10,
    search = null,
    category = null,
    column = "createdAt",
    priority = null,
    direction = -1,
  } = req.query;
  const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
  const pipeline = [
    {
      $match: {
        ...(![undefined, null, ""].includes(search) && {
          title: { $regex: search, $options: "i" },
        }),
      },
    },
    {
      $sort: {
        [column]: Number(direction),
      },
    },

    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: parseInt(pageSize, 10) }],
      },
    },
  ];

  const resp = await getAndCountAll(pipeline);
  return res.status(200).json({
    messag: "you you got all",
    resp,
  });
});

exports.createTask = catchAsyncError(async (req, res, next) => {
  const {
    title,
    description,
    dueDate,
    priority,
    category,
    completedDate,
    taskHolder,
  } = req.body;
  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    category,
    completedDate,
    taskHolder,
  });
  return res.status(201).json({
    message: "task created",
    success: true,
    task,
  });
});
exports.updateTask = catchAsyncError(async (req, res, next) => {
  const { title, priority, category, dueDate, taskHolder } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id },
    {
      title,
      priority,
      category,
      taskHolder,
      dueDate,
    }
  );

  if (!task) {
    return next(new ErrorHandler("Task in not found in DB", 404));
  }

  return res.status(200).json({
    messag: "task updated",
    success: true,
    task: task,
  });
});

exports.deleteTask = catchAsyncError(async (req, res, next) => {
  const { title, priority, category, dueDate, workHolder } = req.body;
  const task = await Task.findOneAndDelete({ _id: req.params.id });

  if (!task) {
    return next(new ErrorHandler("Task in not found in DB", 404));
  }

  res.status(200).json({
    messag: "task deleted",
    success: true,
  });
});

module.exports.completed = catchAsyncError(async (req, res, next) => {
  const date = new Date();
  const task = await Task.findOne({ _id: req.params.id });
  task.isCompleted = true;
  task.completedDate = new Date();
  await task.save();
  res.status(200).json({
    success: true,
    message: "updated successfully",
  });
});

async function getAndCountAll(query) {
  const res = await Transaction.aggregate(query);
  return {
    data: res[0].data,
    count: res[0].metadata
      ? res[0].metadata.length
        ? res[0].metadata[0].total
        : 0
      : 0,
  };
}
