const express=require('express');
const router=express.Router();
const passport=require('passport');
const Studendata=require('../models/student');
const Userdata=require('../models/Users');
const Historydata=require('../models/history');
const Experiencedata=require('../models/experience');

//starttest
router.get('/startt',passport.checkAuthentication,async function(req,res){
    let data=await Studendata.findById(req.query.id).populate('coursename').populate({
        path:'coursename',
        populate: { path:  'question',
		    model: 'question' }
    }).exec();
    return res.render('startt',{data:data});
});

//send data question in form of api
router.get('/api',passport.checkAuthentication,async function(req,res){
    let data=await Studendata.findById(req.query.id).populate('coursename').populate({
        path:'coursename',
        populate: { path:  'question',
		    model: 'question' }
    }).exec();
    return res.status(200).json({
        data:data.coursename.question
    });
});

//submitted test
//update marks
router.get('/submitted',passport.checkAuthentication,async function(req,res){
    //console.log(req.query.id);
    let data=await Studendata.findByIdAndUpdate(req.query.id,{marks:req.query.score});
    Historydata.create({
        user:req.user.id,
        course:data.coursename,
        marks:req.query.score
    },function(err,datas){
        //console.log(datas);
    });
    let exp=await Experiencedata.find({course:data.coursename,user:req.user.id});
    if(exp== ""){
        let re=await Experiencedata.create({
            user:req.user.id,
            course:data.coursename,
            level:req.query.score
        });
        //console.log(re);
    }else{
    let rl=parseInt(exp[0].level)+parseInt(req.query.score);
    let newexp=await Experiencedata.findByIdAndUpdate(exp[0].id,{level:rl});
    //console.log(newexp);
    }
    let ud=await Userdata.findById(req.user.id);
    await Userdata.findByIdAndUpdate(req.user.id,{totalxp:parseInt(ud.totalxp)+parseInt(req.query.score)});
    //console.log(ud.totalxp);
    return res.redirect('/dashboard');
});


module.exports=router;