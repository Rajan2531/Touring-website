const mongoose=require("mongoose");
const validator=require("validator"); // for validation 
const bcrypt=require("bcryptjs");// for encryption
const crypto=require("crypto");
const userSchema=new mongoose.Schema({
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    name:{
        type:String,
        required:[true,'A name must be there']
    },
    email:{
        type:String,
        required:[true,'An email must be there'],
        unique:[true,'Already there'],
        validate:[validator.isEmail]
    },
    photo:{
        type:String,
        default:"default.jpg"
        //required:[true,'A photo must be there']
    },
    role:{
        type:String,
        /// enum is the values that are acceptable for role
        enum:['user','lead-guide','guide','admin']
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
       
        select:false
    },
    passwordConfirm:{
        type:String,
       required:[true,'Please confirm your password'],
        
        validate:{
            validator:function(confirmPassword){
                return confirmPassword===this.password;
            },
            message:'Password not matching'
        },
       
        select:false
    },
    passwordCreatedAt:Date,
    passwordModifiedAt:Date,
    passwordResetToken:{
        type:String
    },
    passwordResetTokenExpire:Date

});
// middleware to encrypt and save password
userSchema.pre('save',async function(next){
    // Only run this function if password was actually modified;
if(!this.isModified('password'))
return next();
// Hash the password with salt of length 12;
this.password=await bcrypt.hash(this.password,12);

/// passwordConfirm is only used for validation, after this it is of no use so we set it to undefined
this.passwordConfirm=undefined;

next();
})

/// middleware to change password modified at attribute when password is changed
userSchema.pre('save',async function(next){
    //only change when password is modified
    if(!this.isModified('password')||this.isNew)
    return next();
    // we are subtracting 1 second from the time of modification since token creation can be done much earlier than password is saved
    this.passwordModifiedAt=Date.now()-1000;
    next();
})

///query middleware to only show objects with active status true
userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    next();
})

// function to compare token created from user trying to login using same secret is same or not
userSchema.methods.correctPassword=async function(candidatePassword, userSavedPassword){
    return await bcrypt.compare(candidatePassword,userSavedPassword);
}
// function to check if password was changed after login
userSchema.methods.checkIfPasswordModifiedAfterLogin=function(JWTTimeStamp){
    if(this.passwordCreatedAt)
    {
        const passwordCreatedAtTime=parseInt(this.passwordCreatedAt.getTime()/1000,10);
        return passwordCreatedAtTime>JWTTimeStamp;
    }
    return false;
}

// function to create a password reset token
userSchema.methods.createPasswordResetToken=function(){
   let resetToken=crypto.randomBytes(32).toString('hex');
   this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
   this.passwordResetTokenExpire=Date.now()+10*60*1000;
   
   return resetToken;
}

const User=mongoose.model('User',userSchema);
module.exports=User;