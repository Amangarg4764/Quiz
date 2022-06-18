const express=require('express');
const router=express.Router();
const passport=require('passport');

//display all item link on dashboard
router.use('/',require("./dashboard"));
//studentcourse
router.use('/',require('./studentcourse'));
//student enrole course req
router.use('/',require('./studentenrolereq'));
//student all joind course
router.use('/',require('./studentjoinedcourse'));
//student test instructionpage
router.use('/',require('./studenttestdetail'));
//student start test
router.use('/',require('./studentstarttest'));

module.exports=router;