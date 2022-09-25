const catchAsync=require('./../utils/catchAsync.js');
// we are building a generic function where we will pass the Model
const mongoose=require('mongoose');
const appError = require('../utils/appError.js');

  
exports.deleteOne=Model=>catchAsync.catchAsync(async(req,res,next)=>{
    const doc=await Model.findByIdAndDelete(req.params.id);
    if(!doc)
    {
        return next(new appError("Document not found",404));
    }
    res.status(200).json({
        status:"success",
        data:doc
    })
})

