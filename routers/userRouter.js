const express=require("express")
const multer=require("multer");
const authControllers=require("./../controllers/authController.js");
const userControllers=require("./../controllers/userControllers.js");

const router=express.Router();
router.get('/logout',authControllers.logout)
router.post("/signup",authControllers.signup);
router.post("/login",authControllers.login);

router.post("/forgotPassword",authControllers.forgetPassword);
router.patch("/resetPassword/:token",authControllers.resetPassword);

router.use(authControllers.protect);

// all routes below are protected since the above route runs before them and if user is logged in then only below middlewares are run

router.patch('/changePassword',authControllers.changePassword);
router.patch('/updateMe',userControllers.uploadUserPhoto,userControllers.resizeUploadPhoto,userControllers.updateMe)
router.delete('/deleteMe',userControllers.deleteMe);
router.route('/').get(userControllers.getAllusers);
module.exports=router;