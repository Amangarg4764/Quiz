const express=require('express');
const router=express.Router();
const passport=require('passport');
const Userdata=require('../models/Users');
const Coursedata=require('../models/Course');
const Studendata=require('../models/student');

//enrole request make by student
router.get('/enroledreq',passport.checkAuthentication,async function(req,res){
    // console.log(req.query.id);
    let reqd=await Studendata.create({
         coursename:req.query.id,
         marks:'0',
         anroleuser:req.user._id,
         enrolestatus:false
     });
    // console.log(reqd);
     let cd=await Coursedata.findById(req.query.id);
     let ud=await Userdata.findById(cd.cuser);
     ud.studentreq.push(reqd);
     ud.save();
    // console.log(ud);
    req.flash('success','Requested submited');
     return res.redirect('back');
 });

module.exports=router;