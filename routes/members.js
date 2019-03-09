const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const alert = require('alert-node');
const passportSetup = require('../config/passport');

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
        successRedirect: '/members/retrieve',
        failureRedirect: '/members/login',
        failureFlash: true
    })(req, res, next);
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


    let errors = req.validationErrors();

    if (errors) {

        res.render('signup', {
            errors: errors
        });

    } else {
        let query = {$or: [{username: username}, {email: email}]};
        Member.findOne(query, (err, user) => {
            if (err) {
                console.log(err);
                res.render("signup");
            }
            if (user) {
                if (user.email === email) {
                    req.flash('cardError', 'The email entered is already in use. Please try logging in');
                    res.render('login')
                } else {
                    req.flash('cardError', 'The userename entered is already in use. Please select a different one');
                    res.render('signup');
                }


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
router.get("/retrieve", ensureAuthenticated, (req, res) => {

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


router.get('/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

// handle the callback after facebook has authenticated the user
router.get('/facebook/redirect', passport.authenticate('facebook', {
			successRedirect : '/members/retrieve',
			failureRedirect : '/'
		}));

//GitHub Auth
router.get('/github', passport.authenticate('github', {
    scope: [ 'user:email', 'profile' ]
}));

//Google Redirect
router.get('/github/redirect', passport.authenticate('github'), (req, res) => {
    
    req.flash('cardSuccess', 'Welcome back '+req.user.username);
    res.redirect('/');
});


//Logout route
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('cardSuccess', 'You are logged out');
    res.redirect('/');
});

//Add this function as a parameter for any route that should only be accessed by users
//EX: router.get("/retrieve", ensureAuthenticated, (req,res)=>{...}
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {

        req.flash('cardError', 'Please Login');

        res.redirect('/members/login');

    }
}

module.exports = router;