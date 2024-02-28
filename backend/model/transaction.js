const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const transSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter the task title"],
  },
  description: {
    type: String,
    require: [true, "Enter the task Description"],
  },
  id: {
    type: String,
  },
  category: {
    type: String,
  },
 
  price: {
    type: Number,
    
  },
  sold:{
    type:Boolean,

  },
  image: {
    type: String,
   
  },
  dateSale: {
    type: Date,
  },
});
module.exports = mongoose.model("transaction",transSchema );
