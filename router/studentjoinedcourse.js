const express=require('express');
const router=express.Router();
const passport=require('passport');
const Experiencedata=require('../models/experience');
const Studendata=require('../models/student');

//student joined course and ther test and dashboard link
//add leader board for all course on based of xp 
router.get('/gototest',passport.checkAuthentication,async function(req,res){
    let ud=await Studendata.findById(req.query.id).populate('coursename').exec();
    //send leader board
    let cl=await Experiencedata.find({course:ud.coursename.id}).populate('user').exec();
    
    //console.log(cl);
    return res.render('eecourse',{data:ud,cl:cl});
});

module.exports=router;