const mongoose=require("mongoose");
const dotenv=require("dotenv");

dotenv.config({path:"./config.env"});
const db=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
const app=require("./app.js");
mongoose.connect(db,{useNewUrlParser:true,
    
}
    
).then(()=>console.log("connection successful"));



const port=3000;
app.listen(process.env.PORT||3000,()=>{
    console.log("App running on port 3000");
});