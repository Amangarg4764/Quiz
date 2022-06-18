const express=require('express');
const router=express.Router();
const passport=require('passport');
const Studendata=require('../models/student');
const Historydata=require('../models/history');

//dashboard link --student ---teacher
router.get('/dashboard',passport.checkAuthentication,function(req,res){
    return res.render('dashboard');
});

//course link ---student ----teacher
router.get('/course',passport.checkAuthentication,function(req,res){
   return  res.render('course');
});

//profile link ---student
router.get('/profile',passport.checkAuthentication,async function(req,res){
    let data=await Studendata.find({}).populate('coursename').exec();
    return res.render('history',{data:data});
});

//history link ---student
router.get('/history',passport.checkAuthentication,async function(req,res){
    let data=await Historydata.find({}).populate('course').exec();
    return res.render('profile',{data:data});
});

//total student --------teacher
router.get('/student',passport.checkAuthentication,function(req,res){
    return res.render('student');
});
//total question --------teacher
router.get('/question',passport.checkAuthentication,function(req,res){
    return res.render('question');
});

module.exports=router;