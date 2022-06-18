const mongoose=require('mongoose');

const question=new mongoose.Schema({
    courseid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course'
    },
    questionstatement:{
        type:String,
        required:true,
    },
    questionpoint:{
        type:String,
        required:true
    },
    option1:{
        type:String,
        required:true
    },
    option2:{
        type:String,
        required:true
    },
    option3:{
        type:String,
        required:true
    },
    option4:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    },
    uuser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
});

const questiondata=mongoose.model('question',question);

module.exports=questiondata;