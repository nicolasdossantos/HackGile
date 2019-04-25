<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-btn small color="light blue white--text" slot="activator">New Story</v-btn>
    <v-card>
      <v-card-title>
        <h2>Create a New Story</h2>
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

          <v-select v-if="!spID"
            label="Sprint"
            :items="sprintNumbers"
            name="sprint"
            v-model="sprint"
            prepend-icon="directions_run"
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
          <v-btn round color="red lighten-2 white--text" @click="clearForm">
            Cancel
            <v-icon dark right>clear</v-icon>
          </v-btn>
          <v-btn color="light-green lighten-2 white--text" round @click="submit">
            Create Story
            <v-icon dark right>check_circle</v-icon>
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import DatabaseService from "../DatabaseService";
import format from "date-fns/format";
import MemberChip from "./MemberChip";

export default {
  name: "NewStoryForm",
  props: {
    pid: String,
    sprintID: String
  },

  data: () => ({
    dialog: false,
    members: [],
    assignedMember: "",
    assignedMemberInfo: "",
    sprints: [],
    names: [],
    sprintNumbers: [],
    project: "",
    spID: "",
   

    title: "",
    priority: "",
    status: "",
    sprint: undefined,
    member: undefined,
    estimatedTime: "",
    description: "",
    inputRules: [v => v.length >= 1 || "Field is required."]
    

  }),

 updated: async function() {
    this.project = this.$store.state.currentProject._id;
  },

  async created() {
    this.project = this.$store.state.currentProject._id;
    this.spID = this.$props.sprintID;
  },
  
  async mounted() {
    
    this.sprints = await DatabaseService.getSprints(this.project);
     

    for (let i = 1; i <= this.sprints.length; i++) {
      await this.sprintNumbers.push(i);
    }
    await this.sprintNumbers.push("Assign it later")
 
    let data = await DatabaseService.getMemberNames(
     this.project
    );
    this.names = data;
    this.names.push("Assign it later");
    this.members = this.$store.state.currentProject.members;
    
  },

  watch:{
    async project(newVal, oldVal){
    //console.log(`Old value: ${oldVal}, New Value ${newVal}`)
    this.sprints = await DatabaseService.getSprints(this.project);  
     
    this.sprintNumbers = [];

    for (let i = 1; i <= this.sprints.length; i++) {
      await this.sprintNumbers.push(i);
    }
    await this.sprintNumbers.push("Assign it later")
 
    let data = await DatabaseService.getMemberNames(
     this.project
    );
    this.names = data;
    this.names.push("Assign it later");
    this.members = this.$store.state.currentProject.members;
    }
  },

  
  methods: {
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
    submit: async function() {

      if(this.spID){
        this.sprint = this.spID;
      }else if(this.sprint === ("Assign it later" || "")){
        this.sprint = undefined
      }else{
        this.sprint = this.sprints[this.sprint -1]._id
      }


      if (this.$refs.form.validate()) {
        let properties = {
          title: this.title,
          priority: this.priority,
          status: this.status,
          sprint: this.sprint,
            
          estimatedTime: parseInt(this.estimatedTime, 10) * 60 * 60,
          description: this.description,
          member:
            this.assignedMemberInfo !== (undefined || "")
              ? await this.assignedMemberInfo._id
              : undefined,
          project: this.project
        };
        console.log(properties);

        //Creates New Story witth fields above
        await DatabaseService.insertStory(properties);
        this.clearForm();

        this.$emit("story-form-complete");
      }
    },

    clearForm: function() {
      this.dialog = false;
      this.title = "";
      this.priority = "";
      this.status = "";
      this.sprint = undefined;
      this.member = undefined;
      this.estimatedTime = "";
      this.description = "";
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