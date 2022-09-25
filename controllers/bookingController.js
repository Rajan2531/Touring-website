const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../Models/bookingModel.js');
const Tour=require('./../Models/tourModel.js');
const catchAsync=require('./../utils/catchAsync.js');
exports.createStripeSession=catchAsync.catchAsync(async(req,res,next)=>{

    //1) get all tour details 
     const tourDetails=await Tour.findById(req.params.tourId);
     console.log(tourDetails.price);
     //2) create a stripe session
     console.log(tourDetails);
     const session=await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url:`${req.protocol}://${req.get('host')}?tourId=${req.params.tourId}&userId=${req.user.id}&price=${tourDetails.price}`,
        cancel_url:`${req.protocol}://${req.get('host')}/`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourId,
        line_items:[
            {
                price_data:{
                    currency:'inr',
                    product_data:{
                        name:tourDetails.name,
                    },
                    unit_amount:tourDetails.price*1000,
                },
               
                quantity:1
            }
        ],
        mode:'payment'
     })

     //3) send session in response

     res.status(200).json(session);
})

exports.createBookingAfterCheckout=catchAsync.catchAsync(async(req,res,next)=>{
    const {tourId,userId,price}=req.query;
    if(!tourId&&!userId&&!price)
    {
        return next();
    }
    const booking=await Booking.create({tourId,userId,price});
    
    // we need to remove the qrery data from the original url since its sensetive data

    res.redirect(req.originalUrl.split('?')[0]);

})

