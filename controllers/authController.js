const User=require("./../Models/userModel.js");
const catchAsync=require("./../utils/catchAsync.js");
const jwt=require("jsonwebtoken");
const appError=require("./../utils/appError.js");
const util=require("util");
const email=require("./../utils/email.js");
const crypto=require("crypto");
const Email = require("./../utils/email.js");
// function to create and send token
///Pending- create a function that will create and send token as response

// sign in token creater for jwt
const signTokenCreator=function(id){
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});

}
exports.signup=catchAsync.catchAsync(async(req,res,next)=>{
   const newUser= await User.create({
    name:req.body.name,
    email:req.body.email,
    photo:req.body.photo,
    role:req.body.role,
    password:req.body.password,
    passwordConfirm:req.body.passwordConfirm
   });

   const url=`${req.protocol}://${req.get('host')}/me`;
   await new email(newUser,url).sendWelcome();

   /// parameters:- payload,secret,time of expire
   const token=signTokenCreator(newUser._id);
//     await emailsend.sendEmail({
//         email:newUser.email,
//         subject:"Congrats on successful registration",
//         text:"hi there , hope you will enjoy here"

// })
    res.status(200).json({
        status:"success",
        token,
        data:{
            user:newUser
        }
    })
})

exports.login=catchAsync.catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;
    //1) check if email and password exists
    //2) check if user exists && password is correct
    //3) if everything ok, send token to client
    if(!email||!password)
    {
        return next(new appError("please provide email and password",400));
    }
    // we needed to use select('+password'), since
    // we made select=false in User schema for password field
    const user=await User.findOne({email}).select('+password');
       
    if(!user||!(await user.correctPassword(password,user.password)))
    {
        return next(new appError("Incorrect email or password",401));
    }
    const token=signTokenCreator(user._id);
    res.cookie("jwt",token,{expires:new Date(Date.now()+10*60*1000)});
    res.status(200).json({
        status:"success",
        token
    });
    
})

exports.protect=catchAsync.catchAsync(async(req,res,next)=>{
    // checking if authorization token exists in request header
    let token;
    console.log(req.headers.authorization);
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer'))
    {
        token=req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.jwt)
    {
        token=req.cookies.jwt;
    }
    console.log(token);
    if(!token)
    {
        return next(new appError("Your are not logged in. Please log in to continue",404));
    }
    // checking if valid token
    const decoded=await util.promisify(jwt.verify)(token,process.env.JWT_SECRET);
    const freshuser=await User.findById({_id:decoded.id});
    // checking if user exists
    if(!(freshuser))
    {
        return next(new appError("User does not exists now",404));
    }
    // checking if password changed after login
    const passwordchangedOrNot=freshuser.checkIfPasswordModifiedAfterLogin(decoded.iat);
    if(passwordchangedOrNot)
    {
        return next(new appError("password changed after login, please login again",401))
    }
    req.user=freshuser;
    res.locals.user=freshuser;
    next();
})
// function to check if user is logged in 
exports.isLoggedIn=catchAsync.catchAsync(async(req,res,next)=>{
    
    if(req.cookies.jwt)
    {
        try{
        const decoded=await util.promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);

        const freshuser=await User.findById({_id:decoded.id});
        console.log(freshuser);
    // checking if user exists
        if(!(freshuser))
        {
            return next(new appError("User does not exists now",404));
        }
    // checking if password changed after login
    const passwordchangedOrNot=freshuser.checkIfPasswordModifiedAfterLogin(decoded.iat);
        if(passwordchangedOrNot)
        {
            return next(new appError("password changed after login, please login again",401))
        }
        res.locals.user=freshuser;
        return next();

    }
    catch(err){
        return next();
    }}
    next();
})

    


exports.restrictTo=(...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role))
        {
            return next(new appError("You are not authorized to access this feature",401));
        }
        next();
    }
}

exports.forgetPassword=async(req,res,next)=>{
    // checking if user email exists
    const user=await User.findOne({email:req.body.email});
    if(!user)
    {
        return next(new appError("Email does not exists",404));
    }
    // creating a reset token by calling instance method of userschema
    const resetToken=user.createPasswordResetToken();
    // we just updated passwordResetToken attribute if database so it is must to save since we want to match with user reset request
    await user.save();
    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    console.log(resetToken)
    try{
    // await emailsend.sendEmail({
    //     email:user.email,
    //     subject:"Link for password reset",
    //     text:resetURL})
    // res.status(200).json({
    //     url:resetURL
    // })
    const message=`Forgot your password. Submit a PATCH request with password and passwordConfrim using the url${resetURL}`;
    await new Email(user,resetURL).sendPasswordReset();
    res.status(200).json({
        resetURL
    })
   }
catch(err)
{
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpire=undefined;
    await user.save();
    return next(new appError("There was an error sending the email",404));
}
}
exports.resetPassword=catchAsync.catchAsync(async (req,res,next)=>{
        
      
        const recievedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
        // Get user based on token
        const user=await User.findOne({passwordResetToken:recievedToken,passwordResetTokenExpire:{$gt:Date.now()}}).select('+password').select('+passwordConfirm')
        //console.log(user.passwordConfirm);
        if(!user)
        {
            return next(new appError("Sorry, try again",404));
        }
       console.log(user);
       // user exists and time is not expired so we will change the password
        user.password=req.body.password;
        user.passwordConfirm=req.body.password;
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpire=undefined;
        console.log(user.passwordConfirm);
        await user.save();
       
        const loginToken=signTokenCreator({_id:user._id});
        res.status(200).json({
            staus:"success",
            message:"password changed successfully",
            token:loginToken
        })



   
})
exports.changePassword=async(req,res,next)=>{
   const userId=req.user._id;
    const currentUser=await User.findById(userId).select("+password");
    if(!currentUser)
    {
        return next(new appError("login with correct credentials",404));

    }
    const recievedCurrentPassword=req.body.currentPassword;
    if(await currentUser.correctPassword(recievedCurrentPassword,currentUser.password))
    {
       currentUser.password=req.body.newPassword;
       currentUser.passwordConfirm=req.body.newpasswordConfirm;
       await currentUser.save(); 
    }
    else
    {
        return next(new appError("Current password does not matches",404));
    }
    const newLoginToken=signTokenCreator(currentUser._id);
    res.cookie('jwt',newLoginToken,{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    })
    res.status(201).json({
        status:"success",
        message:"password updated",
        token:newLoginToken,
        user:{
            currentUser
        }
    })
}

exports.logout=(req,res)=>{
    res.cookie('jwt',"loggedout",{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.status(200).json({
        status:"success"
    })
}