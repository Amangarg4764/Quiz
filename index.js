const express=require('express');
const port=process.env.PORT || 5000;
const app=express();
const path=require('path');
const database=require('./Config/mongoose');
const Userdata=require('./models/Users');
const Historydata=require('./models/history');
const Experiencedata=require('./models/experience');
const Coursedata=require('./models/Course');
const Questiondata=require('./models/question');
const Studendata=require('./models/student');
const cookieParser=require('cookie-parser');
const session = require('express-session');
const passport=require('passport');
const passportLocal = require('./Config/passport-local');
const MongoStore=require('connect-mongo');
const expressLayout=require('express-ejs-layouts');
const bcrypt = require("bcrypt");


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'sitepages'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/assests'));
app.use(cookieParser());
app.use(session({
    name : 'login',
    secret : "#%D#E",
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (24*7 * 10 * 100 * 100)
    },
    store : MongoStore.create({
        mongoUrl:process.env.MONGODB_URL || 'mongodb://localhost:27017/onlinequiz',
        mongooseConnect : database,
        autoRemove : 'disable'
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.get('/',function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/dashboard');
    }
    res.render('login');
});


app.get('/signout',function(req,res,next){
    req.logout(req.user, function(err) {
        if(err) return next(err);
        res.redirect("/");
      });
});
app.get('/signup',function(req,res){
    res.render('signup');
});

app.post('/adduser',function(req,res){
        if(req.body.upassword != req.body.ucpassword){
            console.log("Password did not match");
            return res.redirect('back');
        }
        Userdata.findOne({email:req.body.uemail},async function(err,user){
            if(err){
                console.log("Error in adding data");
                return ;
            }
            if(!user){
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.upassword, salt);

                Userdata.create({
                    email:req.body.uemail,
                    password:hashedPassword,
                    name:req.body.uname,
                    account:req.body.account,
                    totalxp:"0"
                },function(err,newdata){
                    console.log(req.body);
                    if(err){
                        console.log("Error in adding email id in database");
                        return;
                    }
                    return res.redirect('/');
                });
            }
            else{
               
                console.log("User is already created");
                return res.redirect('back');
            }
        });
    });

app.post('/signin',passport.authenticate('local',{failureRedirect : '/'}),function(req,res){
    res.redirect('/dashboard');
});
app.use(expressLayout);

app.use('/',require('./router/index'));

app.get('/addcourse',function(req,res){
    return res.render("addcourseform");
});

app.post('/courseadd',function(req,res){
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
            return res.redirect('/course');
        });
    });
});

app.get('/addquestion',function(req,res){
    Userdata.findById(req.user._id).populate('ccourse').exec(function(err,data){
            return res.render('addquestionform',{course:data.ccourse}); 
     });
});

app.post('/questionadd',async function(req,res){
   /* console.log(req.body);*/
   let udata=await Userdata.findById(req.user._id);
   console.log(udata);
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
            return res.redirect('back');
        });
    });
});
app.get('/gotothequestion',function(req,res){
    //console.log(req.query.id);
    Coursedata.findById(req.query.id).populate('question').exec(function(err,data){
        return res.render('totothequestion',{course:data});
    });
});
app.get('/viewquestion',function(req,res){
    //all question
    Questiondata.find({uuser:req.user._id},function(err,data){
        return res.render("viewquestion",{data:data});
    });
});

//update question
app.post('/questionupdate',async function(req,res){
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
    return res.redirect('back');
});

//delete question
app.get('/questiondelete',async function(req,res){
    //console.log(req.query.id);
    let questionid=await Questiondata.findByIdAndDelete(req.query.id);
    //console.log(questionid);
    let courseu=await Coursedata.findByIdAndUpdate(questionid.courseid,{$pull:{question:req.query.id}});
    //console.log(courseu);
    let useru=await Userdata.findByIdAndUpdate(courseu.cuser,{$pull:{cquestion:req.query.id}});
    //console.log(useru);
    return res.redirect('back');
});

//update course
app.post('/courseupdate',async function(req,res){
    await Coursedata.findByIdAndUpdate(req.query.id,{
        coursename:req.body.coursename,
        coursequestion:req.body.coursequestion,
        coursepoint:req.body.coursepoint,
        ctime:req.body.ctime,
        cpassing:req.body.cpassing
    });
    return res.redirect('back');
});

//delete course
app.get('/coursedelete',async function(req,res){
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
   //console.log(coursea.question);
    return res.redirect('back');
});


app.get('/deletereq',async function(req,res){
    console.log(req.query.id);
    let delreq=await Studendata.findByIdAndDelete(req.query.id);
    await Userdata.findByIdAndUpdate(req.user._id,{$pull:{studentreq:req.query.id}});
    return res.redirect('back');
});
app.get('/addstudent',async function(req,res){
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
app.get('/aprovedreq',async function(req,res){
    console.log(req.query.id);
    await Userdata.findByIdAndUpdate(req.user._id,{$push:{studentapprovd:req.query.id}});
    await Userdata.findByIdAndUpdate(req.user._id,{$pull:{studentreq:req.query.id}});
    let ste=await Studendata.findById(req.query.id);
    ste.enrolestatus="true";
    ste.save();
    console.log(ste);
   await Userdata.findByIdAndUpdate(ste.anroleuser,{$push:{cenrolled:ste}});
    return res.redirect('back');
});

//fetch what you append
app.get('/viewstudentcourse',async function(req,res){
    let ud=await Userdata.findById(req.user._id).populate('studentapprovd').
    populate({
        path:'studentapprovd',
        populate: { path:  'coursename',
		    model: 'course' }
    }).
    populate({
        path:'studentapprovd',
        populate: { path:  'anroleuser',
		    model: 'user' }
    }).exec();
    console.log(ud);
    return res.render('viewstudentcourse',{student:ud.studentapprovd});
});
//and if you want to continue


app.listen(port,function(err){
    if(err){
        console.log("error in port");
        return ;
    }
    console.log("server is up and running",port);
});
