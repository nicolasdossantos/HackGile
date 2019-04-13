const express = require("express");
const mongoose = require("mongoose");
const app = require("../../app.js");
const Story = require("../../models/story");
const router = express.Router();
const Project = require("../../models/project");
const Member = require("../../models/member");

//TODO: Test
//Get Projects for current user
router.get("/", async (req, res) => {
  //Retrieve all current user's projects
  await Project.find(
    {
      members: {
        $in: req.user._id
      }
    },
    (err, projects) => {
      if (err) {
        console.log(err);
      } else {
        res.send(projects);
      }
    }
  );
});



//Tested
// Get all projects for that member id
router.get("/members/:id", async (req, res) => {
  const list = await Project.find({
    members: mongoose.Types.ObjectId(req.params.id)
  })/*
    .populate({
      path: "stories",
      populate: {
        path: "member"
      }
    })*//*
    .populate({
      path: "sprints",
      populate: {
        path: "stories",
        populate: {
          path: "member"
        }
      }
    })*/
    .populate("members")
    .populate("sprints")
    .populate("stories");
  res.send(list);
});

//Post -> Create a new project
router.post("/", async (req, res) => {
  
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("projectType", "Hackathon field is required").notEmpty();
  req.checkBody("endDate", "End Date field is required").notEmpty();
  req.checkBody("endTime", "End Time field is required").notEmpty();

  let errors = req.validationErrors();

  if (!errors) {

  let name = req.body.name;
  let projectType = req.body.projectType;
  let endDate = req.body.endDate;
  let endTime = req.body.endTime;
  let description = req.body.description;
  let hackathonName = req.body.hackathonName;
  let git = req.body.git;
  let owners = req.body.owners;
  let members = req.body.members;

  //time manipulation
  let splitTime = endTime.split(":");
  let epochHour = parseInt(splitTime[0], 10) * 60 * 60;
  let epochMin = parseInt(splitTime[1], 10) * 60;
  let epochEndTime = epochHour + epochMin;

  let deadLine = epochEndTime + Date.parse(endDate);

  let newProject = new Project({
    name: name,
    projectType: projectType,
    hackathonName: hackathonName,
    deadline: deadLine,
    description: description,
    git: git,
    members: members,
    sprints: [],
    stories: [],
    owners: owners
  });
  await newProject.save(err => {
    if (err) {
      console.log(err);
    }
  });
  console.log("SUCCESS")
  res.status(201).send();
}
});

//For Testing purposes
// router.get('/', (req, res)=>{
//     res.render('new_project')
// })

//Tested
//Delete project linked to this pid
router.delete("/:pid", async (req, res) => {
  await Projects.deleteOne({ _id: mongoose.Types.ObjectId(req.params.pid) });
  res.status(200).send();
});

/*============================*/
/* Project Members Array API  */
/*============================*/
//Tested
//Get's all members from project ID
router.get("/:pid/members/", async (req, res) => {
  await Project.findById(mongoose.Types.ObjectId(req.params.pid))
    .populate("members")
    .then(
      project => {
        let members = project.members;
        res.send(members);
      },
      err => {
        console.log(err);
      }
    );
});

//Tested
//Puts a member into a project and project into a member
router.put("/:pid/members/:id", async (req, res) => {
  await Project.findById(req.params.pid, async (err, project) => {
    if (project.members.indexOf(req.params.id) < 0) {
      await Project.updateOne(
        { _id: req.params.pid },
        { $push: { members: mongoose.Types.ObjectId(req.params.id) } }
      );
      await Member.updateOne(
        { _id: req.params.id },
        { $push: { projects: mongoose.Types.ObjectId(req.params.pid) } }
      );
      res.status(200).send();
    }
  });
});

//Puts a member as a owner in project
router.put("/:pid/members/:id", async (req, res) => {
  await Project.findById(req.params.pid, async (err, project) => {
    if (project.members.indexOf(req.params.id) < 0) {
      await Project.updateOne(
        { _id: req.params.pid },
        { $push: { owners: mongoose.Types.ObjectId(req.params.id) } }
      );
      res.status(200).send();
    }
  });
});

//Delete - Remove member from owners
router.delete("/:pid/members/:id", async (req, res) => {
  await Project.updateOne(
    { _id: req.params.pid },
    { $pull: { owners: mongoose.Types.ObjectId(req.params.id) } }
  );
  res.status(200).send();
});

//Tested
//Deletes a member from project and a project from member
router.delete("/:pid/members/:id", async (req, res) => {
  await Project.updateOne(
    { _id: req.params.pid },
    { $pull: { members: mongoose.Types.ObjectId(req.params.id) } }
  );
  await Member.updateOne(
    { _id: req.params.id },
    { $pull: { projects: mongoose.Types.ObjectId(req.params.pid) } }
  );
  res.status(200).send();
});

/*============================*/
/* Project Sprints Array API  */
/*============================*/
//Tested
//Gets all Sprints from project ID
router.get("/:pid/sprints/", async (req, res) => {
  await Project.findById(mongoose.Types.ObjectId(req.params.pid))
    .populate("sprints")
    .then(
      project => {
        let sprints = project.sprints;
        res.send(sprints);
      },
      err => {
        console.log(err);
      }
    );
});

//Tested
//Puts a sprint into a project
router.put("/:pid/sprints/:id", async (req, res) => {
  await Project.findById(req.params.pid, async (err, project) => {
    if (project.sprints.indexOf(req.params.id) < 0) {
      await Project.updateOne(
        { _id: req.params.pid },
        { $push: { sprints: mongoose.Types.ObjectId(req.params.id) } }
      );
      res.status(200).send();
    }
  });
});

//Tested
//Deletes a sprint from project
router.delete("/:pid/sprints/:id", async (req, res) => {
  await Project.updateOne(
    { _id: req.params.pid },
    { $pull: { sprints: mongoose.Types.ObjectId(req.params.id) } }
  );
  res.status(200).send();
});

/*============================*/
/* Project Stories Array API  */
/*============================*/
//Tested
//Gets all stories from project ID
router.get("/:pid/stories/", async (req, res) => {
  await Project.findById(mongoose.Types.ObjectId(req.params.pid))
    .populate("stories")
    .then(
      project => {
        let stories = project.stories;
        res.send(stories);
      },
      err => {
        console.log(err);
      }
    );
});

//Tested
//Puts a story into a project
router.put("/:pid/stories/:sid", async (req, res) => {
  await Project.findById(req.params.pid, async (err, project) => {
    if (project.stories.indexOf(req.params.sid) < 0) {
      await Project.updateOne(
        { _id: req.params.pid },
        { $push: { stories: mongoose.Types.ObjectId(req.params.sid) } }
      );
      
      res.status(200).send();
    }
  });
});

//Tested
//Deletes a story from project -> story is removed from database
router.delete("/:pid/stories/:sid", async (req, res) => {
  await Project.updateOne(
    { _id: req.params.pid },
    { $pull: { stories: mongoose.Types.ObjectId(req.params.sid) } }
  );
  //Needs Testing
  await Story.deleteOne({_id: req.params.sid});
  
  res.status(200).send();
});

module.exports = router;
