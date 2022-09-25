exports.catchAsync=(functionAsParameter)=>{
    return (req,res,next)=>{
        functionAsParameter(req,res,next).catch(err=>next(err));
    }
}