const express=require('express');
const router=express.Router();
const passport=require('passport');
const Userdata=require('../models/Users');
const Coursedata=require('../models/Course');

//view all course
router.get('/viewcourse',passport.checkAuthentication,function(req,res){
    if(req.user.account=="teacher"){
    Userdata.findById(req.user._id).populate('ccourse').exec(function(err,data){
       return res.render('viewcourse',{course:data.ccourse}); 
    });
    }else{
    Coursedata.find({},function(err,data){
        return res.render('viewcourse',{course:data}); 
    });
    }
});

//enrolled course
//after click on enrolled it go to the course
router.get('/enrolecourse',passport.checkAuthentication,async function(req,res){
    let ud=await Userdata.findById(req.user._id).populate('cenrolled').populate({
        path:'cenrolled',
        populate: { path:  'coursename',
		    model: 'course' }
    }).exec();
    //console.log(ud);
    return res.render('viewecwl',{data:ud.cenrolled});
});


module.exports=router;