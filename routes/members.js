const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const alert = require('alert-node');

//Bring in Models
let Story = require('../models/story');
let Member = require('../models/member');
let Project = require('../models/project');
let Sprint = require('../models/story');

//Login form
router.get('/login', (req, res)=>{
    res.render('login');
});

//Login Process
router.post('/login', (req, res, next)=>{
    passport.authenticate('local', {
        successRedirect: '/members/retrieve',
        failureRedirect: '/members/login',
        failureFlash: true
    })(req,res,next);   
});

//--------------------------------------------------------------------//
//Test if database models work:
//--------------------------------------------------------------------//

router.get("/signup", (req, res)=>{
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

    if(errors){
        //Send flash message
        console.log(errors); // For testing only
        res.render('signup', {
            errors: errors
            
        });
        
    }else{
        let query = {username:username};
        Member.findOne(query, (err, user)=>{
            if(err){
                console.log(err);
                res.render("signup");
            }
            if(user){
                console.log("Username in use");
                res.render("signup");
            }else{
                let newMember = new Member({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    username: username,
                    image: '',
                    projects: [],
                    password: password
                });
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newMember.password, salt, (err, hash)=>{
                        if(err){
                         console.log(err);
                        }
                        newMember.password = hash;
                        newMember.save((err)=>{
                            if(err){
                                console.log(err);
                                return;
                            }else{
                                req.flash(null,'You are now registered and can login');
                                res.redirect('/members/login');
                        }
                        });
                    });
                 });
            }
        
        });   
    }
}); 

router.get("/retrieve", ensureAuthenticated, (req,res)=>{
    
    Member.find({}, (err, members)=>{
        if(err){
            console.log(err);
        }else{
            res.render('retrieve', {
                title: "Member",
                members: members
            });
        }
    })
    
    
});

//Logout
router.get('/logout', (req, res)=>{
    req.logOut();
    req.flash('success', 'You are logged out');
    res.redirect('/');
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('success', 'IT WORKS');
        res.locals.message = req.flash();
        res.redirect('/members/login');
       
    }
}

module.exports = router;
