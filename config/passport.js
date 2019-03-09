const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/member');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const keys = require('./keys');

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

        console.log(firstname);

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
        }).catch((error)=>{
            done(error, false, error.message);
        });
           }));

        passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: keys.facebook.clientID,
            clientSecret: keys.facebook.clientSecret,
            callbackURL: '/members/facebook/redirect'
    
        },
    
        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {
    
            // asynchronous
            process.nextTick(function() {
                console.log(profile)
    
                // find the user in the database based on their facebook id
                // User.findOne({ facebookID : profile.id }, function(err, user) {
    
                //     // if there is an error, stop everything and return that
                //     // ie an error connecting to the database
                //     if (err)
                //         return done(err);
    
                //     // if the user is found, then log them in
                //     if (user) {
                //         return done(null, user); // user found, return that user
                //     } else {
                //         // if there is no user found with that facebook id, create them
                //         var newUser            = new User();
    
                //         // set all of the facebook information in our user model
                //         newUser.facebookID    = profile.id; // set the users facebook id                   
                //         newUser.facebookToken = token; // we will save the token that facebook provides to the user                    
                //         newUser.firstname  = profile.name.givenName; // look at the passport user profile to see how names are returned
                //         newUser.lastname = profile.name.lastname;
                //         newUser.email = 'nicolas10019@icloud.com'; // facebook can return multiple emails so we'll take the first
                //         //newUser.image = profile.images[0].value;
    
                //         // save our user to the database
                //         newUser.save(function(err) {
                //             if (err)
                //                 throw err;
    
            //                 // if successful, return the new user
            //                 return done(null, newUser);
            //             });
            //         }
    
            //     });
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
        let githubID = profile.id;


        //Check if user already exists in our database
        User.findOne({email: email}).then((user)=>{
            if(user){
                return done(null, user);
                
            }else{
                new User({
                    username: username,
                    email: email,
                    image: image,
                    githubID: githubID
        
                }).save().then((newUser) => {
                    done(null, newUser);
                });
            }
        }).catch((error)=>{
            done(error, false, error.message);
        });
           }));

}
