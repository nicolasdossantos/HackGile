<template>
  <div class="StoryCard pa-2" v-bind:id="this.$props.id">
    <v-card v-model="dialog" v-on:dblclick="dialog = true" :class="priorityColor">
      <v-card-title primary-title>
        <h1>{{this.title}}</h1>
      </v-card-title>
      <v-card-text>
        <p>{{this.description}}</p>
      </v-card-text>
      <v-card-actions>
        <v-list-tile>
          <v-list-tile-avatar>
            <v-img v-bind:src="this.memberPicture" max-height="40px" max-width="40px"></v-img>
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
              v-model="sprintNum"
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
            <v-btn round color="red lighten-2 white--text" @click="closeAction">
              Cancel
              <v-icon dark right>clear</v-icon>
            </v-btn>
            <v-btn color="light-green lighten-2 white--text" round @click="submit">
              Save Story
              <v-icon dark right>check_circle</v-icon>
            </v-btn>
            <v-btn round color="red white--text" @click.stop="deleteDialog=true">
              Delete Story
              <v-icon dark right>clear</v-icon>
            </v-btn>
            
            <v-dialog v-model="deleteDialog" max-width="290">
              <v-card>
                <v-card-title class="headline">Delete Story?</v-card-title>

                <v-card-text>
                  You are abou to delete this story permanently. Would you like to proceed?
                  </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="green darken-1" flat="flat" @click="deleteDialog = false">Cancel</v-btn>

                  <v-btn color="green darken-1" flat="flat" @click="deleteStory">Delete it!</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
  data: () => ({
    dialog: false,
    members: [],
    assignedMemberInfo: "",
    sprints: [],
    names: [],
    sprintNumbers: [],
    currentProject: "",
    timeInSeconds: "",

    sprintNum: "",
    error: String,
    json: null,
    title: "",
    status: "",
    description: "",
    estimatedTime: "",
    sprint: "",
    priority: "",
    assignedMember: "",
    memberPicture: "",
    inputRules: [],
    deleteAlert: false,
    deleteDialog: false
  }),
  created: async function() {
    await this.updateStory();
    this.currentProject = await this.$store.state.currentProject._id;
    this.sprints = await this.$store.state.currentProject.sprints;

    for (let i = 0; i < this.sprints.length; i++) {
      await this.sprintNumbers.push(i + 1);
      if (this.sprints[i]._id == this.sprint) {
        this.sprintNum = i + 1;
      }
    }
    await this.sprintNumbers.push("Assign it later");
    let data = await DatabaseService.getMemberNames(this.currentProject);
    this.names = data;
    this.names.push("Assign it later");

    this.members = await this.$store.state.currentProject.members;
    if (this.assignedMember != "") {
      await this.getChip();
    }
    [v => v.length >= 1 || "Field is required."];
  },

  mounted: async function() {
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
        this.estimatedTime = parseInt(this.timeInSeconds, 10) / 60 / 60;
        this.assignedMember =
          this.member !== undefined
            ? this.member.firstname + " " + this.member.lastname
            : "";
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
            this.sprintNum === ("Assign it later" || "")
              ? undefined
              : this.sprints[this.sprintNum - 1]._id,
          estimatedTime: parseInt(this.estimatedTime, 10) * 60 * 60,
          description: this.description,
          member:
            this.assignedMemberInfo !== (undefined || "")
              ? this.assignedMemberInfo._id
              : undefined
        };
        console.log(properties);

        await DatabaseService.updateStory(this.$props.id, properties);
        this.updateStory();
        this.$emit("story-form-edit");
        this.dialog = false;
      }
    },

    closeAction: function() {
      this.deleteAlert = false;
      this.dialog = false;
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
      await DatabaseService.deleteStory(this.$props.id);
      this.dialog = false;

      this.$emit("story-deleted");
      this.deleteDialog = false;
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
    },
    priorityColor: function() {
      let color = "";
      if (this.priority == "High") {
        color = "red lighten-3";
      } else if (this.priority == "Medium") {
        color = "orange lighten-3";
      } else {
        color = "light-green lighten-3";
      }

      return color;
    },
    sprintsUpdated: function() {
      return this.$store.state.currentProject.sprints;
    },
    membersUpdated: function() {
      return this.$store.state.currentProject.members;
    },
    projectRefreshed: function() {
      let id = this.$props.id; //Bringing id into scope
      return this.$store.state.currentProject.stories.filter(function(obj) {
        return obj._id === id;
      })[0];
    }
  },
  watch: {
    dialog: function() {
      if (this.dialog == false) {
        //revert back to store
        console.log("dialog closed");
      }
    },
    sprintsUpdated: function() {
      this.sprints = this.$store.state.currentProject.sprints;
      this.sprintNumbers = [];
      for (let i = 0; i < this.sprints.length; i++) {
        this.sprintNumbers.push(i + 1);
        if (this.sprints[i]._id == this.sprint) {
          this.sprintNum = i + 1;
        }
      }
      this.sprintNumbers.push("Assign it later");
    },
    membersUpdated: async function() {
      let data = await DatabaseService.getMemberNames(this.currentProject);
      this.names = data;
      this.names.push("Assign it later");

      this.members = this.$store.state.currentProject.members;
    },
    projectRefreshed: async function() {
      console.log('Story Changed');
      this.updateStory();
    }
  }
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
