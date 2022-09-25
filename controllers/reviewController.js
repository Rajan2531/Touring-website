const catchAsync=require("./../utils/catchAsync.js")
const Review=require("./../Models/reviewModel.js");
const factory=require("./handlerFactory.js")

exports.createReview=catchAsync.catchAsync(async(req,res,next)=>{
    //console.log(req.params.tourId);
    if(!req.body.tourId)
    req.body.tourId=req.params.tourId;
    if(!req.body.userId)
    req.body.userId=req.user.id;
    const newReview=await Review.create(req.body);
    res.status(200).json({
        status:"success",
        review:newReview
    })
})
exports.deleteReview=factory.deleteOne(Review);
exports.getAllReview=catchAsync.catchAsync(async(req,res,next)=>{
    // if we want to populate userId and tourId in review, we will write a query middleware in review schema
    let filter={};
    if(req.params.tourId)
    filter.tourId=req.params.tourId;
    const reviews=await Review.find(filter);
    res.status(200).json({
        status:"success",
        reviews:reviews
    })
})