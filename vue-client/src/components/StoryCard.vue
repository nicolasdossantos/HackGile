<template>
  <div class="StoryCard pa-2" v-bind:id="this.$props.id">
    <v-card v-model="dialog" v-on:dblclick="dialog = true">
      <v-card-title primary-title>
        <h1>{{this.title}}</h1>
      </v-card-title>
      <v-card-text>
        <p>{{this.description}}</p>
      </v-card-text>
      <v-card-actions>
        <v-list-tile>
          <v-list-tile-avatar>
            <v-img
              v-bind:src="this.memberPicture"
              max-height="40px"
              max-width="40px"
            ></v-img>
          </v-list-tile-avatar>
        </v-list-tile>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <h2>Modify Story</h2>
        </v-card-title>

        <v-card-text>
          <v-form class="px-3" ref="form">
            <v-text-field
              label="Story Title*"
              name="title"
              v-model="title"
              prepend-icon="book"
              :rules="inputRules"
            ></v-text-field>

            <v-select
              label="Priority*"
              :items="['High', 'Medium', 'Low']"
              name="priority"
              v-model="priority"
              prepend-icon="announcement"
              :rules="inputRules"
            ></v-select>

            <v-select
              label="Sprint"
              :items="sprintNumbers"
              name="sprint"
              v-model="sprint"
              prepend-icon="directions_run"
              :rules="inputRules"
            ></v-select>

            <v-select
              label="Member"
              :items="names"
              name="assignedMember"
              v-model="assignedMember"
              prepend-icon="face"
              @change="getChip"
              :rules="inputRules"
            ></v-select>

            <v-text-field
              label="Estimated Time*"
              name="estimatedTIme"
              v-model="estimatedTime"
              prepend-icon="access_time"
              :rules="inputRules"
              placeholder="1.5"
              suffix="Hours"
              hint="Enter time in hours"
            ></v-text-field>

            <v-textarea
              name="description"
              v-model="description"
              label="Story Description"
              hint="Plese describe your story."
              prepend-icon="edit"
            ></v-textarea>

            <v-spacer></v-spacer>

            <v-flex v-if="assignedMemberInfo.firstname">
              <v-item-group multiple center>
                <v-subheader>Assigned Member:</v-subheader>
                <v-item>
                  <v-chip
                    slot-scope="{ active, toggle }"
                    :selected="active"
                    @click="toggle"
                    v-model="assignedMemberInfo"
                  >
                    <v-avatar>
                      <img :src="assignedMemberInfo.image">
                    </v-avatar>
                    {{assignedMemberInfo.firstname + ' ' + assignedMemberInfo.lastname}}
                  </v-chip>
                </v-item>
              </v-item-group>
            </v-flex>

            <br>
            <br>

            <v-spacer></v-spacer>
            <v-btn round color="red lighten-2 white--text" @click="dialog = false">
              Cancel
              <v-icon dark right>clear</v-icon>
            </v-btn>
            <v-btn color="light-green lighten-2 white--text" round @click="submit">
              Save Story
              <v-icon dark right>check_circle</v-icon>
            </v-btn>
            <v-btn round color="red white--text" @click="dialog = false">
              Delete Story
            <v-icon dark right>clear</v-icon>
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DatabaseService from "../DatabaseService.js";
import format from "date-fns/format";
import MemberChip from "./MemberChip";
export default {
  name: "StoryCard",
  props: {
    id: String
  },
  data: function() {
    return {
      dialog: false,
      members: [],
      assignedMemberInfo: "",
      sprints: [],
      names: [],
      sprintNumbers: [],
      currentProject: "",
      timeInSeconds: "",

      error: String,
      json: null,
      title: "",
      status: "",
      description: "",
      estimatedTime: "",
      sprint: undefined,
      priority: "",
      assignedMember: undefined,
      memberPicture: "",
      inputRules: [v=> v.length >= 1 || 'Field is required.']
    };
  },
  created: async function() {
    await this.updateStory();
    this.currentProject = await this.$store.state.currentProject._id;
    this.sprints = await DatabaseService.getSprints(this.currentProject);

    for (let i = 1; i <= this.sprints.length; i++) {
      await this.sprintNumbers.push(i);
    }
    await this.sprintNumbers.push("Assign it later");

    this.members = this.$store.state.currentProject.members;
  },
  mounted: async function() {
    fetch(
      "http://localhost:8080/api/projects/" +
        this.$store.state.currentProject._id +
        "/memberNames/"
    )
      .then(data => {
        this.names = data;
        this.names.push("Assign it later");
      })
      .then();
  },
  methods: {
    updateStory: async function() {
      try {
        this.json = await DatabaseService.getStoryById(this.$props.id);
        //console.log(this.json);
        this.title = this.json.title;
        this.status = this.json.status;
        this.description = this.json.description;
        this.sprint = this.json.sprint;
        this.priority = this.json.priority;
        this.timeInSeconds = this.json.estimatedTime;
        this.member = this.json.member;
        this.memberPicture = this.json.member.image;
        this.estimatedTime = this.timeInSeconds / 60 / 60;
        this.assignedMember = this.member.firstname + " " + this.member.lastname;
      } catch (err) {
        this.error = err;
      }
    },
    submit: async function() {
      if (this.$refs.form.validate()) {
        let properties = {
          title: this.title,
          priority: this.priority,
          status: this.status,
          sprint:
            this.sprint === ("Assign it later" || "")
              ? undefined
              : this.sprints[this.sprint - 1]._id,
          estimatedTime: parseInt(this.estimatedTime, 10) * 60 * 60,
          description: this.description,
          member:
            this.assignedMemberInfo !== (undefined || "")
              ? this.assignedMemberInfo._id
              : undefined
        };
        console.log(properties);

        await DatabaseService.updateStory(
          this.$store.state.currentProject,
          properties
        );
        this.updateStory();
      }
    },
    getChip: async function() {
      let assigned = await this.assignedMember;

      if (assigned !== "Assign it later") {
        let name = await this.assignedMember.split(" ");
        let firstname = "";
        let lastname = "";
        if (name.length > 2) {
          firstname = name[0];
          lastname = name[1] + " " + name[2];
        } else {
          firstname = name[0];
          lastname = name[1];
        }
        this.assignedMemberInfo = this.members.find(
          o => o.firstname === firstname && o.lastname === lastname
        );
      } else {
        this.assignedMemberInfo = "";
      }
    },
    deleteStory: async function() {
      //TODO
    }
  },
  computed: {
    fetchImageURL: function() {
      if (this.member == undefined) {
        let string = "require('/images/default-user.jpg')";
        return string;
      } else {
        if (this.member.provider == "local") {
          let string = "require('" + this.memberPicture + "')";
          return string;
        } else {
          return this.memberPicture;
        }
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
.alert {
  color: red;
  margin: -10px;
  padding-left: 10px;
  padding-bottom: 10px;
}
.alert-in-enter-active {
  animation: bounce-in 0.5s;
}

.alert-in-leave-active {
  animation: bounce-in 0.5s reverse;
}

v-date-picker {
  color: red;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
