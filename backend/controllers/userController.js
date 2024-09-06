const ErrorHandler = require("../utils/errorhandler");
const asyncError = require("../middleware/asyncerror");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const cloudinary=require('cloudinary');
const { url } = require("inspector");
// Registering a user
exports.registerUser = asyncError(async (req, res, next) => {
    // Handle avatar upload if it exists
    let avatarResult = null;
    if (req.body.avatar) {
        avatarResult = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });
    }

    const { name, email, password } = req.body;

    console.log(`Register request received with data: ${name}, ${email}`);

    // Create user with  avatar
    const user = await User.create({
        name,
        email,
        password,
        profilepic: avatarResult ? {
            public_id: avatarResult.public_id,
            url: avatarResult.secure_url,
        } : undefined,
        createdAt: new Date()
    });

    console.log('User registered successfully:', user);

    // Send token and respond
    sendToken(user, 201, res);
});

// Logging in a user
exports.loginUser = asyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logout = asyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// Forgot Password
exports.forgotPassword = asyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not Found", 404));
    }

    // Getting Reset Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `http://localhost:3000/password/reset/${resetToken}`;

    const message = `Your Password reset Token is:\n\n${resetPasswordUrl}\n\nIf not requested by you, please ignore this message.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `SoulSync Password Recovery`,
            message: message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to user ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = asyncError(async (req, res, next) => {
    // Creating token in hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been Expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password is not Matching", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});
//Get User Details
exports.getUserDetails=asyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
   res.status(200).json({
    success:true,
    user
   })
})
//Update Password
exports.updatePassword=asyncError(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect ", 401));
    }
    
    if(req.body.newPassword!==req.body.confirmPassword  ){
        return next(new ErrorHandler("Password Does not match ", 401));
    }
     

    user.password=req.body.newPassword;

   await user.save()
   sendToken(user,200,res)

});
//Update User Profile
exports.updateProfile = asyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    let newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    // Check if there's an avatar to update
    if (req.body.avatar && req.body.avatar !== "") {
        
        if (user.avatar && user.avatar.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        // Upload the new avatar
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!updatedUser) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user: updatedUser
    });
});


//Get single Users(admin)-

exports.getSingleUser=asyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler(`User does not exsist with Id : ${req.params.id}`))
    }
    
    res.status(200).json({
        success:true,
        user
    })
})
//Get all Users-admin
exports.getAllUser=asyncError(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

//Update User Role
exports.updateUserRole=asyncError(async(req,res,next)=>{
    const newUserData={
     name:req.body.name,
     email:req.body.email,
    role:req.body.role,
    }
 
 
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
     new:true,
     runValidators:true,
     useFindAndModify:false,
    })
 
    res.status(200).json({
     success:true,
    })
    sendToken(user,200,res)

   
 
 })

//Delete User-Admin
exports.deleteUser=asyncError(async(req,res,next)=>{
     const user=await User.findById(req.params.id)
    if(!user){
        return next (new(ErrorHandler(`User does not exsist with id :${req.params.id}`)))
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
     success:true,
     message:"User deleted Successfully"
    })
    sendToken(user,200,res)
 })

