const mongoose=require('mongoose');

const experience=new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    level:{
        type:String,
        required:true
    }
});

const Experience=mongoose.model('experience',experience);

module.exports=Experience;