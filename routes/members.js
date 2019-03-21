const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const functions = require('../app');



//Bring in Models
let Story = require('../models/story');
let Member = require('../models/member');
let Project = require('../models/project');
let Sprint = require('../models/story');

//Login form
router.get('/login', (req, res) => {
    res.render('login');
});

//Login Process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        successFlash: true,
        failureRedirect: '/members/login',
        failureFlash: true
    },)(req, res, next);
});

//Signup Route
router.get("/signup", (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    //Gather post data from signup form
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    //Verifies if fields were filled properly and if passwords match
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    //Puts errors generated at "CheckBody" into array
     let errors = req.validationErrors();

    if (errors) {
        //Display errors if any
        res.render('signup', {
            errors: errors
        });

    } else {
        //Checks if email or username are already present in the database
        let query = {$or: [{username: username}, {email: email}]};
        Member.findOne(query, (err, user) => {
            if (err) {
                console.log(err);
                res.render("signup");
            }
            //If user is already registered, redirect user to login page and generate message
            if (user) {
                if (user.email === email) {
                    req.flash('cardError', 'The email entered is already in use. Please try logging in');
                    res.render('login')
                } else {
                    req.flash('cardError', 'The userename entered is already in use. Please select a different one');
                    res.render('signup');
                }

            //If user is not in database yet, create new user
            } else {
                let newMember = new Member({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    username: username,
                    image: '',
                    projects: [],
                    password: password
                });
                //Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newMember.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        newMember.password = hash;
                        newMember.save((err) => {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                req.flash('cardSuccess', 'You are now registered and can login');
                                res.redirect('/members/login');
                            }
                        });
                    });
                });
            }
        });
    }
});


//Test to retrieve members from DB
router.get("/retrieve", /*functions.ensureAuthentication,*/(req, res) => {


    Member.find({}, (err, members) => {
        if (err) {
            console.log(err);
        } else {
            res.render('retrieve', {
                title: "Member",
                members: members
            });
        }
    })


});

//Google Auth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//Google Redirect
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //Once user is logged in, their info is available using req.user
    //res.send(req.user);
    req.flash('cardSuccess', 'Welcome back '+req.user.firstname);
    res.redirect('/');
});

//GitHub Auth
router.get('/github', passport.authenticate('github', {
    scope: [ 'user:email', 'profile' ]
}));

//GitHub Redirect
router.get('/github/redirect', passport.authenticate('github'), (req, res) => {
    
    req.flash('cardSuccess', 'Welcome back '+req.user.username);
    res.redirect('/');
});


//Linkedin Auth
router.get('/linkedin', passport.authenticate('linkedin'));
//Linkedin Redirect
router.get('/linkedin/redirect', passport.authenticate('linkedin'), (req, res) => {
    req.flash('cardSuccess', 'Welcome back '+req.user.firstname);
    res.redirect('/');
});

//Forgot Password Route
router.get('/forgot', (req, res)=>{
    res.render('forgot');
});

//Forgot Post
router.post('/forgot', (req,res,next)=>{
    async.waterfall([
        (done)=>{
            //Creates a 20 character encrypted token
            crypto.randomBytes(20, (err, buf)=>{
                let token = buf.toString('hex');
                done(err,token);
            });
        },
        //Find user by email and add assigns token and expiration to user in database
        (token, done) => {
            Member.findOne({email: req.body.email}, (err, user)=>{
                if(!user){
                    req.flash('cardError','No account linked to this email.');
                    return res.redirect('forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save((err)=>{
                    done(err,token,user);
                });
                
            });

        },
        //Send email for password reset
        (token, user, done)=>{
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'infohackgile@gmail.com',
                    pass: 'nicolasthomasgerard'
                }

            });
            let mailOptions = {
                to: user.email,
                from: 'infohackgile@gmail.com',
                subject: 'HackGile Password Request',
                text: 'You told us you forgot your passowrd. If you really did, click here to choose a new one:'+
                    '\n\n http://localhost:8080/members/reset/' + token + '\n\n'+
                    'If you didn\'t mean to, please ignore this email. Your password will remain unchanged.'
            };
            smtpTransport.sendMail(mailOptions, (err)=>{
                console.log('email sent')
                console.log(user)
                
                req.flash('cardSuccess','An email has been sent to '+user.email + ' with further instructions.')
                done(err,'done');
            });
        }
    ], (err)=>{
        if (err) return next(err);
       res.redirect('forgot');
    });
});

//Reset Route...Find user by token
router.get('/reset/:token', (req, res)=>{
    Member.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err,user)=>{
        if(!user){
            req.flash('cardError', 'Password reset token is invalid or has expired');
            return res.redirect('/members/forgot');
            console.log(err)
        }
        res.render('reset', {user: req.user});
});
    });

//Changes user password, hashes and salts it
router.post('/reset/:token', (req,res)=>{
    async.waterfall([
        (done)=>{
            Member.findOne({resetPasswordToken: req.params.token, resetPasswordExpires:{$gt: Date.now()}}, (err,user)=>{
                if(!user){
                    req.flash('cardError', 'Password reset token is invalid or has expired');
                    return res.redirect('/members/forgot');
                    console.log(err)
                }
                //Validate fields **NEEDS TESTING**
                req.checkBody('password', 'Password is required').notEmpty();
                req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
            
                //Puts errors generated at "CheckBody" into array
                let errors = req.validationErrors();
            
                if (errors) {
                    //Display errors if any
                    res.render('reset', {
                        errors: errors
                    });
                }

                user.password = req.body.password;
                user.resetPasswordExpires = undefined;
                user.resetPasswordToken = undefined;

                //Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) {
                            console.log(err);
                        }
                        user.password = hash;
                        user.save((err) => {
                            if (err) {
                                console.log(err);
                                return;
                            } else {
                                req.logIn(user, (err)=>{
                                    done(err,user);
                                });
                            }
                        });
                    });
                });

                
            });
            },
        (user, done)=>{
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'infohackgile@gmail.com',
                    pass: 'nicolasthomasgerard'
                }

            });
            let mailOptions = {
                to: user.email,
                from: 'infohackgile@gmail.com',
                subject: 'Your Password Has Been Changed',
                text: 'This is a confirmation that the password for your account has been changed.\n'
                +'Thank you!'
            };
            smtpTransport.sendMail(mailOptions, (err)=>{
                console.log('email sent')
                req.flash('cardSuccess','Success! Your password has been changed!');
                res.redirect('/');
                done(err,'done');
            });
        }
    ], (err)=>{
        if (err) return next(err);
       res.redirect('forgot');
    });
});

//Forgot username Route
router.get('/forgot_username', (req, res)=>{
    res.render('forgot_username');
});

//Forgot Post
router.post('/forgot_username', (req,res,next)=>{
        let email = req.body.email;
        //console.log(email)
        Member.findOne({email: email}, (err, user)=>{
            if(err){
                req.flash('cardError', 'The email entered does not match any records in our database.')
            }else{
                console.log(user);
                let smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'infohackgile@gmail.com',
                        pass: 'nicolasthomasgerard'
                    }
                });
                let mailOptions = {
                    to: user.email,
                    from: 'infohackgile@gmail.com',
                    subject: 'HackGile Username Request',
                    text: 'Hello, it seems that you have forgoten your username. Don\'t worry, we got you:\n'
                    +'Your username is: '+user.username
                };
                smtpTransport.sendMail(mailOptions, (err)=>{
                    console.log('email sent')
                    console.log(user)
                    
                    req.flash('cardSuccess','An email has been sent to '+user.email + ' with your username.');
                    res.redirect('login');
                    done(err,'done');
                });
            }
        
});
});



//Logout route
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('cardSuccess', 'You are logged out');
    res.redirect('/');
});

//Account settings route
router.get('/account', (req, res) => {
    if (req.user){
        res.render('account');
    }else{
        res.redirect('/');
    }
});


module.exports = router;


function ensureAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('cardError', 'Please Login');

        res.redirect('/members/login');

     }
}
