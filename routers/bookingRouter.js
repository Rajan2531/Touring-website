const express=require("express");
const bookingsController=require('./../controllers/bookingController.js');
const authController=require('./../controllers/authController.js');
const router=express.Router();

 router.get('/create-stripe-session/:tourId',authController.protect,bookingsController.createStripeSession)

 module.exports=router

