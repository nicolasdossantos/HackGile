const express = require('express');
const router = express.Router();

//Bring in Models
let Story = require('../models/story');
let Member = require('../models/member');
let Project = require('../models/project');
let Sprint = require('../models/story');

router.get("/test", (req, res)=>{
    res.render('test');
});

router.get("/login", (req, res)=>{
    res.render('login');
});

router.get("/signup", (req,res)=>{
    res.render('signup');
});


//--------------------------------------------------------------------//
//Test if database models work:
//--------------------------------------------------------------------//


router.post('/test', (req, res) => {
    let member= new Member();
     member.firstname = req.body.firstname;
     member.lastname = req.body.lastname;
     member.password = req.body.password;
     member.email = req.body.email;
     member.image = "";
     member.projects = [];
     member.stories = [];

     member.save((err) => {
         if (err) {
             console.log(err);
             return;
         } else {
             req.flash('success', 'Article Added');
             res.redirect('/');
         }
     });
});

router.get('/retrieve', (req, res)=>{
 Member.find({}, (err, members) => {
     if (err) {
         console.log(err);
     } else {
         res.render('retrieve', {
             title: "Members",
             members: members
         });
     }
 });
});

module.exports = router;