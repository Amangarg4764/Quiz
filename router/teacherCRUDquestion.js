const express=require('express');
const router=express.Router();
const passport=require('passport');
const Userdata=require('../models/Users');
const Coursedata=require('../models/Course');
const Questiondata=require('../models/question');

//go to the question page
router.get('/addquestion',passport.checkAuthentication,function(req,res){
    Userdata.findById(req.user._id).populate('ccourse').exec(function(err,data){
            return res.render('addquestionform',{course:data.ccourse}); 
     });
});

//create question
router.post('/questionadd',passport.checkAuthentication,async function(req,res){
    /* console.log(req.body);*/
    let udata=await Userdata.findById(req.user._id);
    //console.log(udata);
     Coursedata.findById(req.body.qcoursename,function(err,cdata){
         Questiondata.create({
             courseid:req.body.qcoursename,
             questionstatement:req.body.questionstatement,
             questionpoint:req.body.questionpoint,
             option1:req.body.option1,
             option2:req.body.option2,
             option3:req.body.option3,
             option4:req.body.option4,
             answer:req.body.answer,
             uuser:udata._id
         },function(err,qdata){
             cdata.question.push(qdata);
             udata.cquestion.push(qdata);
             cdata.save();
             udata.save();
             req.flash('success','Question saved to the course');
             return res.redirect('back');
         });
     });
 });

//read question
router.get('/gotothequestion',passport.checkAuthentication,function(req,res){
    //console.log(req.query.id);
    Coursedata.findById(req.query.id).populate('question').exec(function(err,data){
        return res.render('totothequestion',{course:data});
    });
});
router.get('/viewquestion',passport.checkAuthentication,function(req,res){
    //all question
    Questiondata.find({uuser:req.user._id},function(err,data){
        return res.render("viewquestion",{data:data});
    });
});



//update question
router.post('/questionupdate',passport.checkAuthentication,async function(req,res){
    //console.log(req.query.id);
    await Questiondata.findByIdAndUpdate(req.query.id,{
        questionstatement: req.body.questionstatement,
        questionpoint:  req.body.questionpoint,
        option1:  req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
        answer: req.body.answer
    });
    req.flash('success','Question updated Successfully');
    return res.redirect('back');
});

//delete question
router.get('/questiondelete',passport.checkAuthentication,async function(req,res){
    //console.log(req.query.id);
    let questionid=await Questiondata.findByIdAndDelete(req.query.id);
    //console.log(questionid);
    let courseu=await Coursedata.findByIdAndUpdate(questionid.courseid,{$pull:{question:req.query.id}});
    //console.log(courseu);
    let useru=await Userdata.findByIdAndUpdate(courseu.cuser,{$pull:{cquestion:req.query.id}});
    //console.log(useru);
    req.flash('success','Question is Successfully deleted');
    return res.redirect('back');
});

module.exports=router;