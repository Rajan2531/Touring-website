const reviewController=require("./../controllers/reviewController.js");
const express=require('express')
const authController=require("./../controllers/authController.js");
const router=express.Router({mergeParams:true});

router.route('/').get(reviewController.getAllReview).post(authController.protect,authController.restrictTo('user'),reviewController.createReview);
router.route('/:id').delete(reviewController.deleteReview);
module.exports=router;