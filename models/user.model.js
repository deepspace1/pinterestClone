const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

try{
    mongoose.connect("mongodb://localhost:27017/pinterest");
    // mongoose.connect("mongodb+srv://harshkumar170604:danny123@cluster0.kezwcrd.mongodb.net/pinterest");
    console.log("Succesfully connected to mongoDB");
}catch(error){
    console.log("MongoDB connection failed" , error)
}

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        unique:true,
    },
    posts:[{
        type : mongoose.Schema.Types.ObjectId,
        ref :"Post"
    }
    ],
    dp:{
        type:String
    }
},
{
    timestamps:true
})

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);