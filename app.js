const path=require('path');
const express= require("express");
const fs=require("fs");
const app=express();
const tourRouter=require(`./routers/tourRouter.js`);
const userRouter=require('./routers/userRouter.js');
const appError = require("./utils/appError.js");
const reviewRouter=require('./routers/reviewRouter.js');
const bookingRouter=require('./routers/bookingRouter.js');
const errorHandlingMiddleware=require("./controllers/errorController.js");
const viewsRouter=require("./routers/viewsRouter.js");
const helmet=require("helmet");
const cors=require("cors");
const cookieParser=require("cookie-parser")
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],
   
        fontSrc: ["'self'", 'https:', 'data:'],
  
        scriptSrc: ["'self'", 'unsafe-inline'],
   
        scriptSrc: ["'self'", 'https://*.cloudflare.com'],
   
        scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
   
        styleSrc: ["'self'", 'https:', 'unsafe-inline'],
   
        connectSrc: ["'self'", 'data',"http://127.0.0.1:3000"],
        frameSrc:["'self'",'https://js.stripe.com/']
      },
    })
  );

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
/// **** creating own middileware*****
app.use((req,res,next)=>{
    // console.log(req.body);
    // console.log("displaying incomming cookies");
    // console.log(req.cookies);
    next();
})



//app.get('/api/v1/tours',getAllTours)
//app.get('/api/v1/tours/:id',getTour)
//app.post("/api/v1/tours",createTour);

//app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.use("/",viewsRouter)
app.use("/api/v1/tours",tourRouter);
app.use("/api/v1/users",userRouter);
app.use('/api/v1/review',reviewRouter);
app.use('/api/v1/bookings',bookingRouter);
// for handling unhandled routes
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     "status":"failed",
    //     "messege":`Can't find ${req.originalUrl} on this server`
    // })
    // const error=new Error(`Can't find ${req.originalUrl} on this server`);
    // error.status='fail';
    // error.statusCode=404;
    const message=`Can't find ${req.originalUrl} on this server`;
    next(new appError(message,404));
});

///*****declaring error handling middleware */
app.use(errorHandlingMiddleware);


module.exports=app;