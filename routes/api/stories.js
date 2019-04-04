const express = require("express");
const mongoose = require("mongoose");
const app = require("../../app.js");
let Story = require("../../models/story");

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
      estimatedTime: req.body.estimatedTime
    }
  );
  res.status(200).send();
});

//Add story to sprint
//TODO: Test
//Deletes Story by ID -> Removes story from Project, Sprint, Member
router.delete("/:sid", async (req, res) => {
  await Project.updateMany(
    { stories: { $in: req.user.sid } },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );
  await Member.updateMany(
    { stories: { $in: req.user.sid } },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );
  await Sprint.updateOne(
    { stories: { $in: req.user.sid } },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );

  await Story.deleteOne({ _id: mongoose.Types.ObjectId(req.params.sid) });
  res.status(200).send();
});

module.exports = router;
