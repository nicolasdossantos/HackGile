const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app.js');
let Story = require('../../models/story');

const router = express.Router();

// -- Tested --
//Fetches all stories linked to member ID. Move to members.js?
router.get('/:id', async (req, res) => {
    const list = await Story
        .find({member: mongoose.Types.ObjectId(req.params.id)})
        /*.populate('sprint')*/
        .populate('member');
    res.send(list);
});

//Post new story -- Tested -- 
router.post('/', async (req, res) => {
    let newStory = new Story({
        sprint: undefined,
        status: "Backlog",
        member: undefined,
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

//TODO: Test
//Updates Story by ID
router.put('/:sid', async (req, res) => {
    const stories = await loadStoriesCollection();
    stories.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(req.params.sid)},
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
router.delete('/:sid', async (req, res) => {
    
    await Story.deleteOne({_id: mongoose.Types.ObjectId(req.params.sid)});
    res.status(200).send();
})

module.exports = router;