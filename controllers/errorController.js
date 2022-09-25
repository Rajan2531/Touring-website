const sendErrorForDevelopmentMode=function(err,res){
    if(err.code===11000)
    err.message="Duplicate data";
    res.status(err.statusCode).json({

        status:err.status,
        error:err,
        message:err.message,
        errorStack:err.errorStack
    })
}
const sendErrorForProductionMode=function(err,res)
{
    if(err.isOperational)
    {
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }
    else
    {
        res.status(500).json({
            status:"error",
            message:err.message
        })
    }
}
const castErrorHandler=function(err)
{
    
}
module.exports=(err,req,res,next)=>{
 
    err.status=err.status||'error';
    err.statusCode=err.statusCode||500;
    if(process.env.NODE_ENV==='Development')
    {
        sendErrorForDevelopmentMode(err,res);
    }
    else if(process.env.NODE_ENV==='Production')
    {
        if(err.name==='cast')
        sendErrorForProductionMode(err,res);
    }
    
}