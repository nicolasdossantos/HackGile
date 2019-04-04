const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app.js');
let Story = require('../../models/story');

const router = express.Router();

//Tested
//Fetches all stories linked to member ID. Move to members.js?
router.get('/:id', async (req, res) => {
    const list = await Story
        .find({member: mongoose.Types.ObjectId(req.params.id)})
        /*.populate('sprint')*/
        .populate('member');
    res.send(list);
});

//TODO: Test
router.post('/', async (req, res) => {
    let newStory = new Story({
        sprint: mongoose.Types.ObjectId(""),
        status: "Backlog",
        member: mongoose.Types.ObjectId(""),
        title: "This is just a Test",
        description: "This is the description",
        estimatedTime: "10"
    });
    await newStory.save(err => {
        if (err) {
          console.log(err);
        }
      });
    res.status(201).send();
});

//TODO: Test
//Updates Story by ID
router.put('/:id', async (req, res) => {
    const stories = await loadStoriesCollection();
    stories.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(req.params.id)},
        {
            sprint: mongoose.Types.ObjectId(req.body.sprint),
            status: req.body.status,
            member: mongoose.Types.ObjectId(req.body.member),
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime
        });
    res.status(200).send();
})

//TODO: Test
//Deletes Story by ID
router.delete('/:id', async (req, res) => {
    const posts = await loadStoriesCollection();
    await posts.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
    res.status(200).send();
})

async function loadStoriesCollection(){
    return app.collection('stories');
}

module.exports = router;