const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app.js');
let Story = require('../../models/story');

const router = express.Router();

//Member ID passed in
router.get('/:id', async (req, res) => {
    const stories = await loadStoriesCollection();
    const list = await Story
        .find({member: mongoose.Types.ObjectId(req.params.id)})
        /*.populate('sprint')*/
        .populate('member');
    res.send(list);
});

router.post('/', async (req, res) => {
    const stories = await loadStoriesCollection();
    let newStory = new Story({
        project: req.body.project,
        sprint: req.body.sprint,
        status: req.body.status,
        member: req.body.member,
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime
    });
    await newStory.save(err => {
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
            project: req.body.project,
            sprint: req.body.sprint,
            status: req.body.status,
            member: req.body.member,
            title: req.body.title,
            description: req.body.description,
            estimatedTime: req.body.estimatedTime
        });
    res.status(200).send();
})

router.delete('/:id', async (req, res) => {
    const posts = await loadStoriesCollection();
    await posts.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
    res.status(200).send();
})

async function loadStoriesCollection(){
    return app.collection('stories');
}

module.exports = router;