const mongoose=require('mongoose');

const history=new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    marks:{
        type:String,
        required:true
    }
},{
    timestamps:true
});

const Historydata=mongoose.model('history',history);

module.exports=Historydata;