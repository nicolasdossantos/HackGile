const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app.js');
let Project = require('../../models/project');

const router = express.Router();

router.get('/:id', async (req, res) => {
    const list = await Project
        .find({member: mongoose.Types.ObjectId(req.params.id)})
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

router.delete('/:id', async (req, res) => {
    const projects = await loadProjectsCollection();
    await projects.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
    res.status(200).send();
})

/*============================*/
/*Project Members Modifier API*/
/*============================*/
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

router.put('/:pid/members/:id', async (req, res) => {
    //const projects = await loadProjectsCollection();
    // await Project.update({_id: req.params.pid},
    //     {$push: {members: mongoose.Types.ObjectId(req.params.id)}})
    let project = await projects.findOne({_id: mongoose.Types.ObjectId(req.params.pid)});
    //TODO: Don't know if should push object id or push populated bson
    await project.members.push(mongoose.Types.ObjectId(req.params.id));
    res.status(200).send();
})

router.delete('/:pid/members/:id', async (req, res) => {
    const projects = await loadProjectsCollection();
    let project = await projects.findOne({_id: mongoose.Types.ObjectId(req.params.pid)});
    project.members.pull(mongoose.Types.ObjectId(req.params.id));
    res.status(200).send();
})

async function loadProjectsCollection(){
    return app.collection('projects');
}

module.exports = router;