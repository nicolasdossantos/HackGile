const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/member');
const bcrypt = require('bcryptjs');
const keys = require('./keys');

//Making all strategies available throughout project
module.exports = (passport) => {
   
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

    //Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {

        //Match Username
        let query ={$or: [{username: username}, {email: username}]};
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
        let provider = profile.provider;

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
                    provider: provider
        
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        }).catch((error)=>{
            done(error, false, error.message);
        });
           }));

       
    //GitHub Strategy
    passport.use(new GitHubStrategy({
        //options for strategy
        callbackURL: '/members/github/redirect',
        clientID: keys.github.clientID,
        clientSecret: keys.github.clientSecret,
        scope: [ 'user:email' ]
    }, (accessToken, refreshToken, profile, done) => {
        
        // //Putting information gathered from profile into variables for readability
        // let firstname = profile.name.givenName;
        // let lastname = profile.name.familyName;
        let username = profile.username;
        let email = profile.emails[0].value;
        let image = profile.photos[0].value;
        let provider = profile.provider;


        //Check if user already exists in our database
        User.findOne({email: email}).then((user)=>{
            if(user){
                return done(null, user);
                
            }else{
                new User({
                    username: username,
                    email: email,
                    image: image,
                    provider: provider
        
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        }).catch((error)=>{
            done(error, false, error.message);
        });
           }));


     //Linkedin Strategy
     passport.use(new LinkedinStrategy({
        //options for strategy
        callbackURL: '/members/linkedin/redirect',
        clientID: keys.linkedin.clientID,
        clientSecret: keys.linkedin.clientSecret,
        scope: ['r_basicprofile', 'r_emailaddress'],    
        state: true    
      },
      function(req,token, refreshToken, profile, done) {
        //Putting information gathered from profile into variables for readability
        let firstname = profile.name.givenName;
        let lastname = profile.name.familyName;
        let email = profile.emails[0].value;
        let image = profile.photos[0].value;
        let provider = profile.provider;

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
                    provider: provider
                    
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        }).catch((error)=>{
            done(error, false, error.message);
        });
           }));
}
