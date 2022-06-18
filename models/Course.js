const mongoose=require('mongoose');

const course=new mongoose.Schema({
    coursename:{
        type:String,
        required:true
    },
    coursequestion:{
        type:String,
        required:true,
    },
    coursepoint:{
        type:String,
        required:true,
    },
    cuser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    question:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'question'
    }],
    ctime:{
        type:String,
        required:true
    },
    cpassing:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Coursedata=mongoose.model('course',course);

module.exports=Coursedata;