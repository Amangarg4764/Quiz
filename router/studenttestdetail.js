const express=require('express');
const router=express.Router();
const passport=require('passport');
const Studendata=require('../models/student');

//make test
router.get('/test',passport.checkAuthentication,async function(req,res){
    //console.log(req.query.id);
    let data=await Studendata.findById(req.query.id).populate('coursename').populate({
        path:'coursename',
        populate: { path:  'question',
		    model: 'question' }
    }).exec();
    //console.log(data);
    return res.render('test',{i:data});
});


module.exports=router;