const { findById } = require("../Models/userModel.js");
const Tour=require("./../Models/tourModel.js");
const catchAsync=require("./../utils/catchAsync.js")



exports.getSignupForm=catchAsync.catchAsync(async(req,res,next)=>{
    res.status(200).render('signup',{title:"Sign up to get registered!"})
})

exports.getOverview=catchAsync.catchAsync(async (req,res,next)=>{
    // 1) get tour data from collection
    const tours=await Tour.find();
    // 2) Build template
    // 3) Render that template using tour data from 1




    res.status(200).render('overview',{
        title:"all tours",
        tours
    })
})

exports.getTour=catchAsync.catchAsync(async (req,res,next)=>{
    // 1) get the data for requested tour(includeding reviews and guides)
        const tour=await Tour.findOne({slug:req.params.slug}).populate({
            path:'reviews',
            fields:'review rating userId'
        })
        res.status(200).render('tour',{
            tour
        }) 
})

exports.getLoginForm=(req,res)=>{
    res.status(200).render('login',{title:"Log into your account"});
}

exports.getAccount=catchAsync.catchAsync(async(req,res,next)=>{
    
    res.status(200).render('userAccount');
})


