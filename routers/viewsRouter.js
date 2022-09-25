const express=require("express")
const router=express.Router();
const bookingController=require("./../controllers/bookingController.js");
const viewsController=require("./../controllers/viewsController.js")
const authController=require("./../controllers/authController.js");

router.get('/me',authController.protect,viewsController.getAccount);
router.get('/',authController.isLoggedIn,bookingController.createBookingAfterCheckout,viewsController.getOverview)
router.get('/overview',(req,res)=>{
    res.status(200).render('overview',{
        title:"All tours",
       
    })
})
router.get('/tours/:slug',authController.isLoggedIn,viewsController.getTour)
router.get('/login',authController.isLoggedIn,viewsController.getLoginForm)





module.exports=router;