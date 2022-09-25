const express=require("express");
const tourController=require('./../controllers/tourControllers.js');
const authController=require('./../controllers/authController.js');
const reviewController=require('./../controllers/reviewController.js');
const reviewRouter=require('./../routers/reviewRouter.js');

const router=express.Router();
router.use("/:tourId/review",reviewRouter);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/').get(tourController.getAllTours).post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);
router.route('/top-5-cheap').get(tourController.topFiveCheapAlias,tourController.getAllTours);

router.route('/:id').get(tourController.getTour).patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.updateTour).delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

/// here code is duplicate so we can mount this url to reviewrouter.
// router.route('/:tourId/review').post(authController.protect,authController.restrictTo('user'),reviewController.createReview)

module.exports=router;

