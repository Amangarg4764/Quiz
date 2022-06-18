const mongoose=require('mongoose');

const User=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    account:{
        type:String,
        required:true
    },//create course
    ccourse:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course'
    }],//create question
    cquestion:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'question'
    }],//course req
    studentreq:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'enrole'
    }],//create approved
    studentapprovd:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'enrole'
    }],//course enrolled
    cenrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'enrole'
    }],
    totalxp:{
        type:String
    }
    
},{
    timestamps:true
});

const Userdata=mongoose.model('user',User);

module.exports=Userdata;