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
        members: res.body.members, //Assuming it was passed in a members object ID array
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

router.put('/:id', async (req, res) => {
    const stories = await loadStoriesCollection();
    stories.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(req.params.id)},
        {
            name: res.body.name,
            ishackathon: res.body.ishackathon,
            deadline: res.body.deadline,
            description: res.body.description,
            git: res.body.git,
            members: res.body.members, //Assuming it was passed in a members object ID array
            sprints: res.body.sprints, //Assuming it was passed in a sprints object ID array
            stories: res.body.stories  //Assuming it was passed in a stories object ID array
        });
    res.status(200).send();
})

router.delete('/:id', async (req, res) => {
    const projects = await loadProjectsCollection();
    await projects.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
    res.status(200).send();
})

async function loadProjectsCollection(){
    return app.collection('projects');
}

module.exports = router;