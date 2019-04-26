<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-btn small color="light blue white--text" slot="activator">
      New Project
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Add a New Project</h2>
      </v-card-title>

      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field
            label="Project Name*"
            name="name"
            v-model="name"
            prepend-icon="folder"
            :rules="inputRules"
          ></v-text-field>


          <v-select
            label="Project Type*"
            :items="['Hackathon Project', 'School Project', 'Personal Project']"
            name="projectType"
            v-model="projectType"
            prepend-icon="assignment"
           :rules="inputRules"
          ></v-select>
          <transition
            name="alert-in"
            enter-active-class="animated flipInX"
            leave-active-class="animated flipOutX"
          >
            <p class="alert" v-if="errors.has('projectType')">{{ errors.first('projectType') }}</p>
          </transition>

          <v-autocomplete
            v-if="projectType == 'Hackathon Project'"
            v-bind:items="hackathons"
            label="Hackathon Name*"
            name="hackathonName"
            v-model="hackathonName"
            prepend-icon="laptop"
          ></v-autocomplete>

          <v-layout row>
            <v-flex xs12 md6>
              <v-menu>
                <v-text-field
                  slot="activator"
                  label="End Date*"
                  prepend-icon="date_range"
                  :value="formattedDate"
                  :rules="inputRules"
                
                  name="endDate"
                ></v-text-field>

                <v-date-picker
                 v-model="endDate" 
                 light color="light-green lighten-2"
                 ></v-date-picker>
              
              </v-menu>
            </v-flex>
            <v-flex xs12 md6>
              <v-menu
                ref="menu"
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="endTime"
                lazy
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endTime"
                    label="End Time*"
                    prepend-icon="access_time"
                    v-on="on"
                    :value="formattedTime"
                   :rules="inputRules"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="menu2"
                  v-model="endTime"
                  @click:minute="$refs.menu.save(endTime)"
                  color="light-green lighten-2"
                  format="ampm"
                ></v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>
         

      

          <v-text-field 
          prepend-icon="code" 
          name="git" 
          v-model="git" 
          label="Git Repository">
          </v-text-field>
         
          <v-textarea
            name="description"
            v-model="description"
            label="Project Description"
            hint="Plese describe your project."
            prepend-icon="edit"
          ></v-textarea>
         
          <v-spacer></v-spacer>
          <v-btn round color="red lighten-2 white--text" @click="clearForm">
            Cancel
            <v-icon dark right>clear</v-icon>
          </v-btn>
          <v-btn color="light-green lighten-2 white--text" round @click="submit">
            Add Project
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

export default {
  data: () => ({
    dialog: false,
    hackathons: null,
    isHackathon: false,
    menu2: false,

    name: "",
    projectType: "",
    endTime: "",
    endDate: "",
    hackathonName: "",
    description: "",
    git: "",
    member: undefined,
    inputRules: [
      v=> v.length >= 1 || 'Field is required.'
      
    ]
  }),
  mounted: async function() {
    fetch("http://hackgile.org/projects/scrape")
      .then(response => response.json())
      .then(data => {
        this.hackathons = data;
      })
      .then();
    this.member = await DatabaseService.getCurrentUserId();
  },
  computed: {
    formattedDate() {
      return this.endDate ? format(this.endDate, "MMM Do YYYY") : "";
    },
    formattedTime() {
      let hours;
      let amPM = "AM";
      if (this.endTime) {
        let splitTime = this.endTime.split(":");
        if (splitTime[0] <= 12) {
          hours = splitTime[0];
        } else {
          hours = parseInt(splitTime[0], 10) - 12;
          amPM = "PM";
        }

        let text = hours + ":" + splitTime[1] + " " + amPM;
        
        return text;
      } else {
        return "";
      }
    }
  },
  methods: {
    submit: async function() {
      if(this.$refs.form.validate()){
      let proprties = {
        name: this.name,
        projectType: this.projectType,
        endDate: this.endDate,
        endTime: this.endTime,
        hackathonName: this.hackathonName,
        description: this.description,
        git: this.git,
        members: [this.member],
        owners: [this.member]
      };

      //Creates New Project witth fields above
      await DatabaseService.insertProject(proprties);
      this.clearForm();

      this.$emit("project-form-complete");
      }
    },

    clearForm: function() {
      this.dialog = false;
      this.name = "";
      this.projectType = "";
      this.endDate = "";
      this.endTime = "";
      this.git = "";
      this.projectType = "";
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
  color: red
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