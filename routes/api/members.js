const express = require("express");
const mongoose = require("mongoose");
const app = require("../../app.js");
const router = express.Router();
const Member = require("../../models/member");
const Story = require("../../models/story");

//Puts story into member and assign member to story...Change story status to Assigned
router.put("/:id/stories/:sid", async (req, res) => {
  await Member.findById(req.params.id, async (err, member) => {
    if (member.stories.indexOf(req.params.sid) < 0) {
      await Member.updateOne(
        { _id: req.params.id },
        { $push: { stories: mongoose.Types.ObjectId(req.params.sid) } }
      );
      await Story.updateOne(
        { _id: req.params.sid },
        {
          $set: {
            member: mongoose.Types.ObjectId(req.params.id),
            status: "Assigned"
          }
        }
      );
      res.status(200).send();
    }
  });
});

//Gets all stories assigned to member id
router.get("/:id/stories/", async (req, res) => {
  await Member.findById(mongoose.Types.ObjectId(req.params.id))
    .populate("stories")
    .then(
      member => {
        let stories = member.stories;
        res.send(stories);
      },
      err => {
        console.log(err);
      }
    );
});

//Removes one story from member's story array - Changes story status to backlog - Set story's member to undefined
router.delete("/:id/stories/:sid", async (req, res) => {
  await Member.updateOne(
    { _id: req.params.id },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );
  await Story.updateOne(
    { _id: req.params.sid },
    { $set: { status: "Backlog", member: undefined } }
  );
  res.status(200).send();
});

module.exports = router;
