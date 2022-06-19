const express=require('express');
const router=express.Router();
const passport=require('passport');
const Studendata=require('../models/student');
const Userdata=require('../models/Users');

//get student
router.get('/addstudent',passport.checkAuthentication,async function(req,res){
    let ud=await Userdata.findById(req.user._id).populate('studentreq').
    populate({
        path:'studentreq',
        populate: { path:  'coursename',
		    model: 'course' }
    }).
    populate({
        path:'studentreq',
        populate: { path:  'anroleuser',
		    model: 'user' }
    }).exec();
    //console.log(ud);
    return res.render('addstudent',{student:ud.studentreq});
});

//aproved request -->see in view student course --> student ka couress
router.get('/aprovedreq',passport.checkAuthentication,async function(req,res){
    console.log(req.query.id);
    await Userdata.findByIdAndUpdate(req.user._id,{$push:{studentapprovd:req.query.id}});
    await Userdata.findByIdAndUpdate(req.user._id,{$pull:{studentreq:req.query.id}});
    let ste=await Studendata.findById(req.query.id);
    ste.enrolestatus="true";
    ste.save();
    console.log(ste);
   await Userdata.findByIdAndUpdate(ste.anroleuser,{$push:{cenrolled:ste}});
   req.flash('success','You have approved!');
    return res.redirect('back');
});

//delete request
router.get('/deletereq',passport.checkAuthentication,async function(req,res){
    console.log(req.query.id);
    let delreq=await Studendata.findByIdAndDelete(req.query.id);
    await Userdata.findByIdAndUpdate(req.user._id,{$pull:{studentreq:req.query.id}});
    req.flash('success','You have Rejected student');
    return res.redirect('back');
});

module.exports=router;