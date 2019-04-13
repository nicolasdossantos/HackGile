<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-btn small fab dark color="indigo" slot="activator">
      <v-icon dark>add</v-icon>
    </v-btn>
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
         
         <v-select
            label="Sprint*"
            :items="['1', '2', '3', 'No Sprint']"
            name="sprint"
            v-model="sprint"
            prepend-icon="directions_run"
           :rules="inputRules"
          ></v-select>

         <v-text-field
            label="Estimated Time*"
            name="estimatedTIme"
            v-model="estimatedTime"
            prepend-icon="access_time"
            :rules="inputRules"
          ></v-text-field>
       

         

          <v-textarea
            name="description"
            v-model="description"
            label="Story Description"
            hint="Plese describe your story."
            prepend-icon="edit"
          ></v-textarea>

         <v-spacer></v-spacer>
       

        <v-item-group multiple center>
        <v-subheader>Assigned Member:</v-subheader>
        <v-item
          v-for="member in members"
          :key="member"
        >
          <v-chip
            slot-scope="{ active, toggle }"
            :selected="active"
            @click="toggle"
          >
            <v-avatar>
                <img :src="member.image">
              </v-avatar>
              {{member.firstname + ' ' + member.lastname}}
          </v-chip>
        </v-item>
      </v-item-group>


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
import MemberChip from "./MemberChip"

export default {
  components:{
    MemberChip
  },

  data: () => ({
    members:[],
    assignedMember: ''





  }),
  mounted: async function() {
    fetch("http://localhost:8080/api/projects/5ca7a58c1c9d4400006b8cfa/members/")
      .then(response => response.json())
      .then(data => {
        this.members = data;
      })
      .then();
  },
  computed: {
    
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