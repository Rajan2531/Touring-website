
const appError=require("./../utils/appError.js");
const User=require("./../Models/userModel.js");
const catchAsync=require("./../utils/catchAsync.js");
const multer=require("multer");
const sharp=require("sharp");
const { findByIdAndUpdate } = require("../Models/tourModel.js");
// to save file in disk
// const multerStorage=multer.diskStorage({
//     destination:(req,file,fun)=>{
//         fun(null,'public/img/users');
//     },
//     filename:(req,file,fun)=>{
//         const fileExtention=file.mimetype.split('/')[1];
//         fun(null,`user-${req.user.id}-${Date.now()}-${fileExtention}`)
//     }

// })

// to save file in memory to resize faster
const multerStorage=multer.memoryStorage();
const multerFilter=(req,file,fun)=>{
    if(file.mimetype.startsWith('image'))
    {
        fun(null,true);
    }
    else
    {
        fun(new appError("Please upload image file",400),false);
    }
}

const upload=multer({
   storage: multerStorage,
    fileFilter:multerFilter
})

exports.uploadUserPhoto=upload.single('photo');
exports.resizeUploadPhoto=(req,res,next)=>{
    //console.log(req);
    if(!req.file)
    return next();
    req.file.fileName=`user-${req.user.id}-${Date.now()}.jpeg`
    sharp(req.file.buffer).resize(500,500).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.fileName}`);
    next();

}
const filterObj=function(obj,...allowedToUpdate)

{
    let acceptableValues={}; // to store the keys which can be updated in database
    Object.keys(obj).forEach((el)=>{
        if(allowedToUpdate.includes(el))
        acceptableValues[el]=obj[el];
    })
    return acceptableValues;

}

exports.getAllusers=async(req,res)=>{
    try{
        const allusers=await User.find({active:true});
        res.status(200).json(allusers);
    }
    catch(err)
    {
        res.status(400).json(err);
    }
}

exports.updateMe=catchAsync.catchAsync(async(req,res,next)=>{
   
    // checking if user is trying to change password
    
    if(req.body.password||req.body.passwordConfirm)
    {
        return next(new appError("This is not correct route to change password. Please use changePassword route to change ",400));
    }
    // filtering the request data by removing all unchangable data
    const allowedToUpdate=['name','email'];
    const itemsToBeUpdated=filterObj(req.body,...allowedToUpdate);
    if(req.file)
    {
        itemsToBeUpdated.photo=req.file.fileName;
    }
    const updatedUser=await User.findByIdAndUpdate(req.user._id,itemsToBeUpdated,{new:true,runValidators:true});
    res.user=updatedUser;
    res.status(200).json({
        status:"success",
        user:updatedUser
    })
})

exports.deleteMe=catchAsync.catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user._id,{active:false});
    res.status(200).json({
        status:"success",
        data:"null"
    })
});