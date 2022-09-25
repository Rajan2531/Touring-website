const mongoose=require('mongoose');

const bookingSchema=new mongoose.Schema({
    tourId:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true, 'Booking must have a Tour']
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'A booking must have a User']
    },
    price:{
        type:Number,
        required:[true,'Booking must have a price']
    },
    craetedAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
})


//populating tour and user, whenever there is a query

bookingSchema.pre(/^find/,function(next){
    this.populate('tourId').populate({
        path:'userId',
        select:'name'
    })
    next();
})



const Booking=mongoose.model('Booking',bookingSchema);

module.exports=Booking