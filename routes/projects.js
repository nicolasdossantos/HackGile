const express = require('express');
const router = express.Router();
const functions = require('../app');
const flash = require('connect-flash');

//Bring in models
let Member = require('../models/member');
let Project = require('../models/project');

router.get('/home', (req,res)=>{
    
    Project.find({members:{$in:req.user._id}}, (err, project) => {
        if (err) {
            console.log(err);
        } else {
            res.render('home', {
                title: "Projects",
                project: project
            });
        }
    })
});

router.get('/new_project', (req, res)=>{
    res.render('new_project');
});

router.post('/new_project', (req, res)=>{
    let name = req.body.name;
    let isHackathon = req.body.ishackathon;
    let duration = req.body.duration;
    let description = req.body.description;
    let git = req.body.git;
    let member = req.user._id;

    //Field verification here:
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('ishackathon', 'Hackathon field is required').notEmpty();
    req.checkBody('description', 'Description fiels is required').notEmpty();
    req.checkBody('git', 'Git URL is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        //Display errors if any
        res.render('new_project', {
            errors: errors
        });

     } else {

    let newProject = new Project({
        name: name,
        ishackathon: isHackathon,
        duration: duration,
        description: description,
        git: git,
        members: member


    });

    newProject.members.push(req.user._id);

    newProject.save((err)=>{
        if(err){
            console.log(err)
            req.flash('cardError', err);
        }else{
            req.flash('cardSuccess', 'Project created!');
            res.redirect('/');
        }
    })
}

});
   
   
   
  



module.exports = router;