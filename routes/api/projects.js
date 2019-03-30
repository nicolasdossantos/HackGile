const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app.js');
let Project = require('../../models/project');

const router = express.Router();

//Tested
router.get('/:id', async (req, res) => {
    const list = await Project
        .find({members: mongoose.Types.ObjectId(req.params.id)})
        .populate({
            path: "stories",
            populate: {
              path: "member"
            }
          })
          .populate({
            path: "sprints",
            populate: {
              path: "stories",
              populate: {
                path: "member"
              }
            }
          })
          .populate("members");
    res.send(list);
});

//TODO: Test
router.post('/', async (req, res) => {
    let newProject = new Project({
        name: res.body.name,
        ishackathon: res.body.ishackathon,
        deadline: res.body.deadline,
        description: res.body.description,
        git: res.body.git,
        members: [],
        sprints: [],
        stories: []
    });
    await newProject.save(err => {
        if (err) {
          console.log(err);
        }
      });
    res.status(201).send();
});

//TODO: Test
router.delete('/:id', async (req, res) => {
    const projects = await loadProjectsCollection();
    await projects.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
    res.status(200).send();
})

/*============================*/
/*Project Members Modifier API*/
/*============================*/
//Tested
router.get('/:pid/members/', async (req, res) => {
    await Project.findById(mongoose.Types.ObjectId(req.params.pid))
        .populate('members')
        .then((project) => {
            let members = project.members;
            res.send(members);
        },
        (err) => {
            console.log(err);
        })
})

//Tested
router.put('/:pid/members/:id', async (req, res) => {
    await Project.findById(req.params.pid), async (err, project)=>{
        if(project.members.indexOf(req.params.id) < 0){
            await Project.updateOne({_id: req.params.pid},
            {$push: {members: mongoose.Types.ObjectId(req.params.id)}})
            res.status(200).send();
        }
    }
})

//Tested
router.delete('/:pid/members/:id', async (req, res) => {
    await Project.updateOne({_id: req.params.pid},
      {$pull: {members: mongoose.Types.ObjectId(req.params.id)}})
    res.status(200).send();
})

async function loadProjectsCollection(){
    return app.collection('projects');
}

module.exports = router;