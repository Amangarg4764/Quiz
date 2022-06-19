const express=require('express');
const port=process.env.PORT || 5000;
const app=express();
const path=require('path');
const database=require('./Config/mongoose');
const Userdata=require('./models/Users');
const cookieParser=require('cookie-parser');
const session = require('express-session');
const passport=require('passport');
const passportLocal = require('./Config/passport-local');
const MongoStore=require('connect-mongo');
const expressLayout=require('express-ejs-layouts');
const bcrypt = require("bcrypt");
const flash=require('connect-flash');
const custommw=require('./Config/middleware');
var cors = require('cors');

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
app.use(flash());
app.use(custommw.setFlash);
app.use(passport.setAuthenticatedUser);
app.use(cors({
    origin:"*"
}));
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With,Content-Type,Accept");
    next();
});
app.get('/',function(req,res){
    if(req.isAuthenticated()){
        req.flash('success','You have Are already logged in');
        return res.redirect('/dashboard');
    }
    res.render('login');
});


app.get('/signout',function(req,res,next){
    req.logout(req.user, function(err) {
        if(err) return next(err);
        req.flash('success','You have logged out successfully');
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
                    req.flash('success','Account Created');
                    return res.redirect('/');
                });
            }
            else{
                req.flash('error','User is already created');
                console.log("User is already created");
                return res.redirect('back');
            }
        });
    });

app.post('/signin',passport.authenticate('local',{failureRedirect : '/'}),function(req,res){
    console.log(req.user.name);
    req.flash('success','Welcome back '+req.user.name);
    res.redirect('/dashboard');
});

app.use(expressLayout);
app.use('/',require('./router/index'));

//and if you want to continue

app.listen(port,function(err){
    if(err){
        console.log("error in port");
        return ;
    }
    console.log("server is up and running",port);
});
