const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/member');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = (passport)=>{
    //Local Strategy
    passport.use(new LocalStrategy((username, password, done)=>{
        
        //Match Username
        let query = {username:username};
        User.findOne(query, (err, user)=>{
            if(err){
                console.log(err);
            }
            if(!user){
                return done(null, false, {message: 'No User Found'})
            }

            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, "Wrong Password");
                }
            });
        });
    }));

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user);
        });
    }); 

}