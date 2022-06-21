const express=require('express');
const router=express.Router();
const passport=require('passport');
const Userdata=require('../models/Users');
const Coursedata=require('../models/Course');
const Questiondata=require('../models/question');
const Studendata=require('../models/student');

//go to add course page
router.get('/addcourse',passport.checkAuthentication,function(req,res){
    return res.render("addcourseform");
});

//addcourse
router.post('/courseadd',passport.checkAuthentication,function(req,res){
    // console.log(req.body);
     Userdata.findById(req.user._id,function(err,user){
         Coursedata.create({
             coursename:req.body.coursename,
             coursequestion:req.body.coursequestion,
             coursepoint:req.body.coursepoint,
             cuser:user._id,
             ctime:req.body.timelimit,
             cpassing:req.body.coursepassingpoint
         },function(err,newcourse){
             //console.log(newcourse);
             user.ccourse.push(newcourse);
             user.save();
             req.flash('success','Course created..');
             return res.redirect('/course');
         });
     });
 });
 
//update course
router.post('/courseupdate',passport.checkAuthentication,async function(req,res){
    await Coursedata.findByIdAndUpdate(req.query.id,{
        coursename:req.body.coursename,
        coursequestion:req.body.coursequestion,
        coursepoint:req.body.coursepoint,
        ctime:req.body.ctime,
        cpassing:req.body.cpassing
    });
    req.flash('success','Course Updated..');
    return res.redirect('back');
});

//delete course
router.get('/coursedelete',passport.checkAuthentication,async function(req,res){
    //console.log(req.query.id);
    let coursea=await Coursedata.findById(req.query.id);
    Coursedata.findById(req.query.id,function(err,course){
        course.remove();
        Questiondata.deleteMany({courseid:req.query.id},function(err,data){
           
        });
    });

    await Userdata.findByIdAndUpdate(req.user._id,{$pull:{ccourse:req.query.id}});
    //it will not delete question which are in userprofile solve it
    for(var  i=0;i<coursea.question.length;i++){
        await Userdata.findByIdAndUpdate(req.user._id,{$pull:{cquestion:coursea.question[i]}});
    }
    //delete all from student and enrolled user
    let ed=await Studendata.find({coursename:req.query.id});
    
    console.log(ed);
   //console.log(coursea.question);
   req.flash('success','Successfully deleted the course.');
    return res.redirect('back');
});



module.exports=router;