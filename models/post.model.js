const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
    },
    postImage:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

},{timestamps:true});

module.exports = mongoose.model('Post', postSchema);