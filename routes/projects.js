const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const nodemailer = require("nodemailer");
const keys = require("../config/keys");
const db = require("../app");
let cheerio = require("cheerio");
const rp = require("request-promise");

//Bring in models
let Member = require("../models/member");
let Project = require("../models/project");

//Home route
router.get("/home", ensureAuthentication, async (req, res) => {
  //Retrieve all current user's projects
    const members = await loadMemberCollection();
    res.send(await members.find({}).toArray())

//   Project.find(
//     {
//       members: {
//         $in: req.user._id
//       }
//     },
//     (err, projects) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.render("home", {
//           title: "Projects",
//           projects: projects
//         });
//       }
//     }
//   );
});
//New Project Route
router.get("/new_project", ensureAuthentication, (req, res) => {
  res.render("new_project");
});

//Get a json file with all mls hackathons
router.get("/scrape", (req, res) => {
  let hackathonList = [];
  rp("https://mlh.io/seasons/na-2019/events")
    .then(html => {
      let $ = cheerio.load(html);
      
      // console.log(html);
      $(".event-wrapper").each(function(index, element) {
        hackathonList.push(
          $(this)
            .find(".event-link")
            .attr("title").trim()
        );
      });
      res.send(hackathonList);
      
    })

    .catch(console.error.bind(console));
    
});

//

router.post("/new_project", ensureAuthentication, (req, res) => {
  let name = req.body.name;
  let isHackathon = req.body.ishackathon;
  let endDate = req.body.enddate;
  let endTime = req.body.endtime;
  let description = req.body.description;
  let git = req.body.git;
  let member = req.user._id;

  //Field verification here:
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("ishackathon", "Hackathon field is required").notEmpty();
  req.checkBody("description", "Description fiels is required").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    //Display errors if any
    res.render("new_project", {
      errors: errors
    });
  } else {
    //time manipulation
    let splitTime = endTime.split(":");
    let epochHour = parseInt(splitTime[0], 10) * 60 * 60;
    let epochMin = parseInt(splitTime[1], 10) * 60;
    let epochEndTime = epochHour + epochMin;

    let deadLine = epochEndTime + Date.parse(endDate);
    //Create new project
    let newProject = new Project({
      name: name,
      ishackathon: isHackathon,
      deadline: deadLine,
      description: description,
      git: git,
      members: member
    });
    //Save project
    newProject.save(err => {
      if (err) {
        console.log(err);
        req.flash("cardError", err);
      } else {
        req.flash("cardSuccess", "Project created!");
        res.redirect("/");
      }
    });
  }
});
//Project page route
router.get("/:id", (req, res) => {
  //Populates the project with all its nested objects.
  //Ex. calling project.stories doesn't return an ObjectID array but a JSON array
  Project.findById(req.params.id)
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
    .populate("members")
    .exec(function(err, project) {
      res.render("project", {
        project: project
      });
    });
});

router.post("/modal#1", (req, res) => {
  console.log(req.body.duration);
});

//Add member route
router.get("/add_member/:id", (req, res) => {
  res.render("add_member");
});

//Project is found by ID, user found by email. If user is not already present in project, it is then added to it
router.post("/add_member", (req, res) => {
  let email = req.body.email;
  let projectId = req.body.project;

  Member.findOne(
    {
      email: email
    },
    (err, member) => {
      if (!member) {
        // req.flash(
        //   "cardError",
        //   "The email entered does not correspond to an active member."
       // );
        //res.redirect("/projects/add_member/" + projectId);
      } else {
        Project.findById(projectId, (err, project) => {
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
                      "Hello there ,\n" +
                      "You have been added to the project " +
                      project.name +
                      "\nClick here to check out your new project:\n" +
                      "https://hackgile.org/projects/" +
                      project.id
                  };
                  smtpTransport.sendMail(mailOptions, err => {
                    console.log("email sent");
                    //req.flash("cardSuccess", "Member has been added!");
                    //res.redirect("/projects/home");
                    res.status.send(200);
                    done(err, "done");
                    
                  });
                }
              });
            } else {
              // req.flash(
              //   "cardError",
              //   "The member is already part of the project"
              // );
              //res.redirect("/projects/add_member/" + projectId);
            }
          }
        });
      }
    }
  );
});

function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("cardError", "Please Login");
    res.redirect("/members/login");
  }
}

async function loadMemberCollection() {
  return db.db.useDb("test").collection("members");
}

module.exports = router;
