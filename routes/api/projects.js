const express = require("express");
const mongoose = require("mongoose");
const app = require("../../app.js");
const Story = require("../../models/story");
const router = express.Router();
const Project = require("../../models/project");
const Member = require("../../models/member");
const nodemailer = require('nodemailer');
const keys = require('../../config/keys');

//TODO: Test
//Get Projects for current user
router.get("/", async (req, res) => {
  //Retrieve all current user's projects
  await Project.find({
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
    })
    /*
        .populate({
          path: "stories",
          populate: {
            path: "member"
          }
        })*/
    /*
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
    let member = req.body.members[0];

    //time manipulation
    let splitTime = endTime.split(":");
    let epochHour = parseFloat(splitTime[0]) * 60 * 60 * 1000;
    let epochMin = parseFloat(splitTime[1]) * 60 * 1000;
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
    await newProject.save(async(err, project) => {
      if (err) {
        console.log(err);
      }
      console.log(members[0])
      await Member.updateOne(
        { _id:  members[0]}, 
        { $push: {projects:  mongoose.Types.ObjectId(project._id) }} )
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
  await Project.deleteOne({
    _id: mongoose.Types.ObjectId(req.params.pid)
  });
  res.status(200).send();
});

//Get First and last name of members
router.get("/:pid/memberNames", async (req, res) => {
  var names = [];
  await Project.findById(req.params.pid)
    .populate("members")
    .exec(async (err, project) => {
      if (err) {
        //console.log(err)
        res.status(500).send();
      }else{
        await project.members.forEach((member) => {
          names.push(member.firstname + " " + member.lastname);
         
        })
       
        res.send(names);
      }
    })
});
//Get members Pictures
router.get("/:pid/memberPictures", async (req, res) => {
  var images = [];
  await Project.findById(req.params.pid)
    .populate("members")
    .exec((err, project) => {
      project.members.forEach((member) => {
        images.push(member.image);
        
      })
     
      res.send(images);
    })
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
      await Project.updateOne({
        _id: req.params.pid
      }, {
        $push: {
          members: mongoose.Types.ObjectId(req.params.id)
        }
      });
      await Member.updateOne({
        _id: req.params.id
      }, {
        $push: {
          projects: mongoose.Types.ObjectId(req.params.pid)
        }
      });
      res.status(200).send();
    }
  });
});

//Puts a member as a owner in project
router.put("/:pid/members/:id", async (req, res) => {
  await Project.findById(req.params.pid, async (err, project) => {
    if (project.members.indexOf(req.params.id) < 0) {
      await Project.updateOne({
        _id: req.params.pid
      }, {
        $push: {
          owners: mongoose.Types.ObjectId(req.params.id)
        }
      });
      res.status(200).send();
    }
  });
});

//Delete - Remove member from owners
// router.delete("/:pid/members/:id", async (req, res) => {
//   await Project.updateOne({
//     _id: req.params.pid
//   }, {
//     $pull: {
//       owners: mongoose.Types.ObjectId(req.params.id)
//     }
//   });
//   res.status(200).send();
// });






//Tested
//Deletes a member from project and a project from member
router.delete("/:pid/members/:id", async (req, res) => {
  
  await Project.updateOne({
    _id: req.params.pid
  }, {
    $pull: {
      members: mongoose.Types.ObjectId(req.params.id)
    }
  });
  await Member.updateOne({
    _id: req.params.id
  }, {
    $pull: {
      projects: mongoose.Types.ObjectId(req.params.pid)
    }
  });

  await Story.updateMany(
    {project: req.params.pid, member: req.params.id},
    {$set:{member:undefined, status:"Backlog"}}
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
        //console.log(err);
        res.status(500).send();
      }
    ).catch(err => {
      res.status(500).send();
    });
});

//Tested
//Puts a sprint into a project
router.put("/:pid/sprints/:id", async (req, res) => {
  await Project.findById(req.params.pid, async (err, project) => {
    if (project.sprints.indexOf(req.params.id) < 0) {
      await Project.updateOne({
        _id: req.params.pid
      }, {
        $push: {
          sprints: mongoose.Types.ObjectId(req.params.id)
        }
      });
      res.status(200).send();
    }
  });
});

//Tested
//Deletes a sprint from project
router.delete("/:pid/sprints/:id", async (req, res) => {
  await Project.updateOne({
    _id: req.params.pid
  }, {
    $pull: {
      sprints: mongoose.Types.ObjectId(req.params.id)
    }
  });
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
      await Project.updateOne({
        _id: req.params.pid
      }, {
        $push: {
          stories: mongoose.Types.ObjectId(req.params.sid)
        }
      });

      res.status(200).send();
    }
  });
});

//Tested
//Deletes a story from project -> story is removed from database
router.delete("/:pid/stories/:sid", async (req, res) => {
  await Project.updateOne({
    _id: req.params.pid
  }, {
    $pull: {
      stories: mongoose.Types.ObjectId(req.params.sid)
    }
  });
  //Needs Testing
  await Story.deleteOne({
    _id: req.params.sid
  });

  res.status(200).send();
});








//Project is found by ID, user found by email. If user is not already present in project, it is then added to it
router.post("/add_member", async(req, res) => {
  let email = req.body.email;
  let projectId = req.body.project;

 await Member.findOne(
    {
      email: email
    },
    async(err, member) => {
      if (!member) {
        console.log("Member not found")
       req.flash(
          "cardError",
          "The email entered does not correspond to an active member."
        );
      } else {
        await Project.findById(projectId, (err, project) => {
          if (err) {
            console.log(err);
          } else {
            if (project.members.indexOf(member.id) < 0) {
              project.members.push(member.id);
              project.save(err => {
                if (err) {
                  console.log(err);
                } else {
                  let smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                      user: keys.email2.username,
                      pass: keys.email2.password
                    }
                  });

                  let mailOptions = {
                    to: member.email,
                    from: "Hackgile <noreply@hackgile.org>",
                    subject: "You Have Been Added To a New Project!",
                    text:
                      "Hello there,\n" +
                      "You have been added to the project " +
                      project.name +
                      "\nClick here to check out your new project:\n" +
                      "https://hackgile.org/home/" +
                      project.id
                  };
                  smtpTransport.sendMail(mailOptions, err => {
                    console.log("email sent");
                     req.flash("cardSuccess", "Member has been added!");
                    // res.redirect("/home");
                    res.status(200).send();
                    done(err, "done");
                  });
                }
              });
            } else {
              req.flash(
                "cardError",
                "The member is already part of the project"
              );
              //res.redirect("/home;
            }
          }
        });
      }
    }
  );
});



module.exports = router;