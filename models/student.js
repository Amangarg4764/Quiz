const mongoose=require('mongoose');

const enrole=new mongoose.Schema({
    coursename:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course'
    },
    marks:{
        type:String,
        required:true,
    },
    anroleuser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    enrolestatus:{
        type:Boolean
    }
},{
    timestamps:true
});

const enroledata=mongoose.model('enrole',enrole);

module.exports=enroledata;