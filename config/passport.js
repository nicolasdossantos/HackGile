const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/member');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const keys = require('./keys');

module.exports = (passport) => {
    //Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {

        //Match Username
        let query = {username: username};
        User.findOne(query, (err, user) => {
            if (err) {
                console.log(err);
            }
            if (!user) {
                return done(null, false, {message: 'Invalid username/password'})
            }

            //Match Password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, 'Invalid username/password');
                }
            });
        });
    }));


    //Google Strategy
    passport.use(new GoogleStrategy({
        //options for strategy
        callbackURL: '/members/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        
        //Putting information gathered from profile into variables for readability
        let firstname = profile.name.givenName;
        let lastname = profile.name.familyName;
        let email = profile.emails[0].value;
        let image = profile.photos[0].value;
        let googleId = profile.id;

        //Check if user already exists in our database
        User.findOne({email: email}).then((user)=>{
            if(user){
                return done(null, user);
                
            }else{
                new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    image: image,
                    googleID: googleId
        
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        });    
    }));

    //Puts user id in a cookie for browser
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    //Retrieves user info with info from cookie
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}
