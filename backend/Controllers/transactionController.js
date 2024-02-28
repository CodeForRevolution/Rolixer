const Transaction = require("../model/transaction");
const Task = require("../model/taskModel");
const ErrorHandler = require("../utils/Errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const mongoose = require("mongoose");

exports.getAllTransaction = catchAsyncError(async (req, res, next) => {
  const {
    page = 1,
    pageSize = 10,
    search = null,
    sortBy = "title",
    sortdirection = 1,
  } = req.query;
  const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
  const pipeline = [
    {
      $match: {
        ...(![undefined, null, ""].includes(search) && {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { price: parseInt(search) },
            { description: { $regex: search, $options: "i" } },
          ],
        }),
      },
    },
    {
      $sort: {
        [sortBy]: Number(sortdirection),
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

exports.statics = catchAsyncError(async (req, res, next) => {

//     const today = new Date();
// const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
// const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

const today = new Date();
const currentMonth = today.getMonth() +1; // Months are zero-based, so adding 1 to get the current month
console.log("current Month",currentMonth);
//   const statics = await Transaction.aggregate([
//     {
        
//             $match: {
//               $expr: {
//                 $and: [
//                   { $eq: [{ $month: { $toDate: "$dateOfSale" } }, currentMonth] }, // Convert string to date and extract month
//                   { $eq: ["$sold", true] } // Check if sold is true
//                 ]
//               }
//             }
          
//       },
//     {
//       $group: {
//         _id: null,
//         NoOfSoldItem:{
//             $sum:1
//         },
//         totalSaleAmount: {
//           $sum: "$price", // Assuming your transaction amount field is named "amount"
//         },
//       },
//     },
//   ]);


  const statics=await Transaction.aggregate([
    
        {
          $facet: {
            soldTransactions: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $month: { $toDate: "$dateOfSale" } }, currentMonth] }, // Convert string to date and extract month
                      { $eq: ["$sold", true] } // Check if sold is true
                    ]
                  }
                }
              }
              ,
              {
                $group: {
                  _id: null,
                  NoOfSoldItem:{
                      $sum:1
                  },
                  totalSaleAmount: {
                    $sum: "$price", // Assuming your transaction amount field is named "amount"
                  },
                },
              },
            ],
            unsoldTransactions: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $month: { $toDate: "$dateOfSale" } }, currentMonth] }, // Convert string to date and extract month
                      { $eq: ["$sold", false] } // Check if sold is false
                    ]
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  NoOfUnSoldItem:{
                      $sum:1
                  },
                },
              }
              
            ]
          }
        }
     

  ])

  res.status(200).json({
    messag: "got the data",
    totalSaleAmount:statics[0].soldTransactions[0].totalSaleAmount,
    NoOfSoldItem:statics[0].soldTransactions[0].NoOfSoldItem,
    NoOfUnSoldItem:statics[0].unsoldTransactions[0].NoOfUnSoldItem,

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


exports.price=catchAsyncError(async(req,res,next)=>{

    const today = new Date();
const currentMonth = today.getMonth() +2; // Months are zero-based, so adding 1 to get the current month
console.log("current Month",currentMonth);

    const statics = await Transaction.aggregate([
        {
            $match: {
              $expr: {
                $and: [
                  { $eq: [{ $month: { $toDate: "$dateOfSale" } }, currentMonth] }, // Convert string to date and extract month
                //   { $eq: ["$sold", true] } // Check if sold is true
                ]
              }
            }
          },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $and: [{ $gte: ["$price", 0] }, { $lte: ["$price", 100] }] }, then: "0 - 100" },
                  { case: { $and: [{ $gt: ["$price", 100] }, { $lte: ["$price", 200] }] }, then: "101 - 200" },
                  { case: { $and: [{ $gt: ["$price", 200] }, { $lte: ["$price", 300] }] }, then: "201 - 300" },
                  { case: { $and: [{ $gt: ["$price", 300] }, { $lte: ["$price", 400] }] }, then: "301 - 400" },
                  { case: { $and: [{ $gt: ["$price", 400] }, { $lte: ["$price", 500] }] }, then: "401 - 500" },
                  { case: { $and: [{ $gt: ["$price", 500] }, { $lte: ["$price", 600] }] }, then: "501 - 600" },
                  { case: { $and: [{ $gt: ["$price", 600] }, { $lte: ["$price", 700] }] }, then: "601 - 700" },
                  { case: { $and: [{ $gt: ["$price", 700] }, { $lte: ["$price", 800] }] }, then: "701 - 800" },
                  { case: { $and: [{ $gt: ["$price", 800] }, { $lte: ["$price", 900] }] }, then: "801 - 900" },
                  { case: { $gte: ["$price", 900] }, then: "900 and above" }
                ],
                default: "Unknown"
              }
            },
            count: { $sum: 1 }
          }
        }
      ]);
      
      const allRanges = [
        "0 - 100",
        "101 - 200",
        "201 - 300",
        "301 - 400",
        "401 - 500",
        "501 - 600",
        "601 - 700",
        "701 - 800",
        "801 - 900",
        "900 and above"
    ];   
    // Initialize object to store counts for all ranges
    const categoryCount=allRanges.reduce((acc,range)=>{
        return acc[range]=0
    },{});
    const categoryCounts = allRanges.reduce((acc, range) => {
        acc[range] = 0;
        return acc;
    }, {})
    statics.forEach(item => {
        categoryCounts[item._id] = item.count;
    });
    console.log("your category Count",categoryCounts);
      res.status(200).json({
        messag:"got the price range",
        categoryCounts
      })

})


exports.CategoryCount=catchAsyncError(async(req,res,next)=>{

    const categoryCount=await Transaction.aggregate([
        {
            $group:{
                _id:"$category",
                Count:{
                    $sum:1
                }
            }

        }
    ])
res.status(200).json({
    message:"got the data",
    categoryCount
})
    
})


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
