// const { json } = require("express");
const catchAsync=require("./../utils/catchAsync.js");
const apiFeatures = require("../utils/apiFeatures.js");
const Tour=require("./../Models/tourModel.js");
const factory=require("./handlerFactory.js");
exports.createTour=catchAsync.catchAsync(async(req,res,next)=>{
    const newTour=await Tour.create(req,body);
    res.status(200).json({
        status:"sucess",
        data:newTour
    })
})

exports.getAllTours=catchAsync.catchAsync(async (req,res,next)=>{

        // creating query
        // const queryObj={...req.query};
        // const excludedFields=['page','sort','limit','fields'];
        // excludedFields.forEach(el=>delete queryObj[el]);
        
        // let querystring=JSON.stringify(queryObj);
        // querystring=querystring.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
        
        // //chaining query
        // let query=Tour.find(JSON.parse(querystring));
        // if(req.query.sort)
        // {
        //     const sortkeys=req.query.sort.split(',').join(' ');

        //     query=query.sort(sortkeys);
        // }
        // if(req.query.fields){
        //     const neededfields=req.query.fields.split(',').join(' ');
        //     query=query.select(neededfields);
        // }
        // const page=req.query.page||1;
        // const limit=req.query.limit||1;
        // const skip=(page-1)*limit;
        // query.skip(skip).limit(limit);

        let query=Tour.find().populate('guides');
       
        let features=new apiFeatures(query,req.query).sort().filter().fields().pagination();
        

        
       
        
        const alltour=await features.query.populate('guides');
        //console.log("rajan",alltour);
        res.status(200).json({
        status:"success",
        result:alltour.length,
        data:{alltour}
      
    });
})


exports.getTour=catchAsync.catchAsync(async(req,res)=>{
    
   const tour=await Tour.findById(req.params.id).populate('reviews');
   res.status(200).json(tour);
});
exports.createTour=catchAsync.catchAsync(async (req,res,next)=>{
       const testtour=await Tour.create(req.body);
    res.status(201).json(testtour);
    
    }
   
);

exports.updateTour=async (req,res)=>{
    try{
        const testtour=await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(testtour);
    }
    catch(err)
    {
        res.status(204).json(err);
    }
}
exports.deleteTour=factory.deleteOne(Tour);

// exports.deleteTour=async (req,res)=>{
//     try{
//         const testtour=await Tour.findByIdAndDelete(req.params.id);
//         res.status(200).json(testtour);
//     }
//     catch(err)
//     {
//         res.status(404).json(err);
//     }
// }
exports.topFiveCheapAlias=(req,res,next)=>{
    req.query.limit='5';
    req.query.sort="price,-rating";
    req.query.fields="price,rating,durations";
    //console.log(req.query);
    next();
}
exports.getTourStats=async(req,res)=>{
    try{
        const tourstats=await Tour.aggregate([
            { $match:{ratingsAverage:{$gte:4.5}}},
            {
                $group:{
                    _id:null,
                    avgrating:{$avg:'$ratingsAverage'},
                    avgprice:{$avg:'$price'},
                    minprice:{$min:'$price'},
                    maxprice:{$max:'$price'}


                }
            }
        ]);
        res.status(200).json(tourstats);
    }
    catch(err)
    {
        res.status(404).json(err);
    }
}
exports.getMonthlyPlan=async(req,res)=>
{
    const year=req.params.year*1;
    //console.log(year);
    try{
        const monthlyplan=await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{startDates:{$gte:new Date(`${year}-01-01`),
                $lt:new Date( `${year}-12-31`)}
                 }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    numberOfTourStarting:{$sum:1}
                }
            }
            
        ])
        res.status(200).json(monthlyplan);
    }
    catch(err)
    {
        res.status(404).json(err);
    }
}