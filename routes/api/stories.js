const express = require("express");
const mongoose = require("mongoose");
const app = require("../../app.js");
let Story = require("../../models/story");
let Project = require("../../models/project");
let Member = require("../../models/member");
let Sprint = require("../../models/sprint");

const router = express.Router();

//Tested
//Gets Story JSON by story id
router.get("/:sid", async (req, res) => {
  const list = await Story.findOne({
    _id: mongoose.Types.ObjectId(req.params.sid)
  })
    /*.populate('sprint')*/
    .populate("member");
  res.send(list);
});

//Tested
//Post new story
router.post("/", async (req, res) => {
  let status = "";

  if(req.body.sprint === undefined){
    status = "Backlog";
  }

  else if(req.body.sprint !== undefined && req.body.member === undefined){
    status= "Unassigned";
  }
  else{
    status = "Assigned";
  }
  
  
  
  let newStory = new Story({
    sprint: req.body.sprint,
    status: status,
    member: req.body.member,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
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
router.put("/:sid", async (req, res) => {
  const stories = await loadStoriesCollection();
  stories.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.sid) },
    {
      sprint: mongoose.Types.ObjectId(req.body.sprint),
      status: req.body.status,
      member: mongoose.Types.ObjectId(req.body.member),
      title: req.body.title,
      description: req.body.description,
      priority: req.params.priority,
      estimatedTime: req.body.estimatedTime
    }
  );
  res.status(200).send();
});

//Deletes Story by ID -> Removes story from Project, Sprint, Member
router.delete("/:sid", async (req, res) => {
  await Project.updateMany(
    { stories: { $in: req.params.sid } },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );
  await Member.updateMany(
    { stories: { $in: req.params.sid } },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );
  await Sprint.updateOne(
    { stories: { $in: req.params.sid } },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );

  await Story.deleteOne({ _id: mongoose.Types.ObjectId(req.params.sid) });
  res.status(200).send();
});

module.exports = router;
