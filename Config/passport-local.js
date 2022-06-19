const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');
const bcrypt = require("bcrypt");


passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback:true
},
    function(req,email,password,done){
        //console.log(password);
        User.findOne({email:email},async function(err,user){
            //console.log(user.account);
            if(err){
                console.log('err');
                return done(null,false);
            }
            let valid= await bcrypt.compare(password,user.password);
            console.log(valid);
            if(!user || !valid || user.account!=req.body.account){
                req.flash('error','Invalid User/Password');
                console.log('Invalid User');
                return done(null,false);
            }
            return done(null,user);
        });
    }

));


passport.serializeUser(function(user,done){
    done(null,user.id);
});




passport.deserializeUser(function(id,done){
    //de
    User.findById(id,function(err,user){
        if(err){
            console.log('err');
            return;
        }
        return done(null,user);
    });
});


passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
};


passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;