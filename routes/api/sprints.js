const express = require("express");
const mongoose = require("mongoose");
const app = require("../../app.js");
let Sprint = require("../../models/sprint");
let Story = require("../../models/story");

const router = express.Router();

//Tested
//Gets Sprint JSON by sprint id
router.get("/:zid", async (req, res) => {
  const list = await Sprint.findOne({
    _id: mongoose.Types.ObjectId(req.params.zid)
  })
    /*.populate('sprint')*/
    .populate("stories");
  res.send(list);
});

//TODO: Test
//Post new sprint
router.post("/", async (req, res) => {
  let name = req.body.name;
  let time = req.body.time;
  let stories = [];

  let newSprint = new Sprint({
    name: name,
    time: time,
    stories: stories
  });
  await newSprint.save(err => {
    if (err) {
      console.log(err);
    }
  });
  res.status(201).send();
});

//Tested
//Puts story into sprint and assign sprint to story...Change story status to Assigned
router.put("/:zid/stories/:sid", async (req, res) => {
  await Sprint.findById(req.params.zid, async (err, sprint) => {
    if (sprint.stories.indexOf(req.params.sid) < 0) {
      await Sprint.updateOne(
        { _id: req.params.zid },
        { $push: { stories: mongoose.Types.ObjectId(req.params.sid) } }
      );
      await Story.updateOne(
        { _id: req.params.sid },
        {
          $set: {
            sprint: mongoose.Types.ObjectId(req.params.zid),
            status: "Unassigned"
          }
        }
      );
      res.status(200).send();
    }
  });
});

//Tested
//Remove one story from sprint and unassign sprint from story...Change story status to Backlog
router.delete("/:zid/stories/:sid", async (req, res) => {
  await Sprint.updateOne(
    { _id: req.params.zid },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );
  await Story.updateOne(
    { _id: req.params.sid },
    {
      $set: {
        sprint: undefined,
        status: "Backlog"
      }
    }
  );
  res.status(200).send();
});

//Tested
//Remove all stories from sprint, delete sprint, and set story sprint to undefined and status to backlog
router.delete("/:zid", async (req, res) => {
  await Story.updateMany(
    { sprint: req.params.zid },
    { $set: { sprint: undefined, status: "Backlog" } }
  );
  await Sprint.updateOne({ _id: req.params.zid }, { $set: { stories: [] } });
  await Sprint.deleteOne({ _id: mongoose.Types.ObjectId(req.params.zid) });
  res.status(200).send();
});

module.exports = router;
