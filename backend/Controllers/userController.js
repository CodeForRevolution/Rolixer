const ErrorHandler = require("../utils/Errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModels");
const sendToken = require("../utils/jwtToken");


exports.registerUser = catchAsyncError(async (req, res, next) => {
  console.log("you hit the registered route");
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
  });
  const cart = await Cart.create({
    user: user._id,
  });

  user.cart_id = cart._id;
  await cart.save();
  await user.save();

  sendToken(user, 200, res); //this is the substitue of above code ie converted into a peice of function to perform that task
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  try {
    console.log("you hit login", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and pasword", 400));
    }
    const user = await User.findOne({ email: email }).select(
      "name email password"
    ); // we have unselected the password in schema

    if (!user) {
      return next(new ErrorHandler("Invalid Email or password", 401));
    }

    const isPasswordMatched = user.comparePassword(password);

    console.log("which user you have on server", user);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendToken(user, 200, res);
  } catch (error) {}
});

exports.logOut = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    htttpOnly: true,
    secure: true,
  });
  res.status(200).json({
    success: true,
    message: "logout successfully",
  });
});

exports.getUserDetail = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {}
});
