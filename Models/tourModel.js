const mongoose=require("mongoose");
const User=require("./../Models/userModel.js");
const slugify=require("slugify");
const tourSchema=new mongoose.Schema({
    guides:[
        {
            type:mongoose.SchemaTypes.ObjectId,
            ref:'User'
        }
    ],
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    name:{
        type:String,
        required:[true,"A tour must have a name"],
        unique:true
    },
    slug:{
        type:String,
        
    },
    duration:{
        type:Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty']
    },

    rating:{
        type:Number,
        default:4.5
    },
    ratingsAverage:{
        type:Number,
        default:4.5
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true,'A tour must have a price']
    },
    priceDiscount:{
        type:Number
    },
    
    locations:[{
        type:{
                type:String,
                default:'Point',
                enum:['Point'],
            },
        coordinates:[Number],
        address:String,
        description:String
    }],

    summary:{
        type:String,
        trim:true,
        required:[true,'A tour must have a description']
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,'A image cover is required']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date] 

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tourId',
    localField:'_id'
}
)
tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
     next()
})
tourSchema.pre(/^find/,function(next){
    this.populate('guides');
    next();
})
const Tour=mongoose.model('Tour',tourSchema);
module.exports=Tour;   