const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review cant be empty']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tourId:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Review must belong to a tour']
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A review must belong to a user']
        }
});

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:"userId",
        select:"name photo"
    }).populate({
        path:"tourId",
        select:"name photo"
    });
    next();
})

const Review=mongoose.model('Review',reviewSchema);

module.exports=Review;