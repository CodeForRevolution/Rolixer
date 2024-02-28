const express=require("express");
const { registerUser, loginUser, logOut,  getUserDetail,  } = require("../Controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../utils/auth");
const router=express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);
router.route("/me").get( isAuthenticatedUser,getUserDetail);

module.exports=router;