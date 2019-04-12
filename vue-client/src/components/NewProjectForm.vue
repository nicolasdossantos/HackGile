<template>
    <v-dialog v-model="dialog" max-width="600px">
        <v-btn small fab dark color="indigo" slot="activator">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <h2>Add a New Project</h2>
          </v-card-title>

          <v-card-text>
                <v-form class="px-3">
                  <v-text-field label="Project Name*" name="name" v-model="name" prepend-icon="folder"></v-text-field>
      
                  <v-select
                    label="Project Type*"
                    :items="['Hackathon Project', 'School Project', 'Personal Project']"
                    name="projectType"
                    v-model="projectType"
                    prepend-icon="assignment"
                  ></v-select>
                
                  <v-autocomplete v-if="projectType == 'Hackathon Project'"
                    v-bind:items="hackathons"
                    label="Hackathon Name*"
                    name="hackathonName"
                    v-model="hackathonName"
                    prepend-icon="laptop"
                  ></v-autocomplete>
             
                  <v-menu >
                    <v-text-field
                     slot="activator" 
                     label="End Date" 
                     prepend-icon="date_range"
                     :value="formattedDate"
                     left
                     flat
                     ></v-text-field>
                    <v-date-picker v-model="endDate" color="green white--text" flat></v-date-picker>
                  </v-menu>
                  <!-- TODO: Implement time picker -->
           
                  <v-text-field prepend-icon="code" name="git" v-model="git" label="Git Repository"></v-text-field>
            
                  <v-textarea
                    name="description"
                    v-model="description"
                    label="Project Description"
                    hint="Plese describe your project."
                    prepend-icon="edit"
                  ></v-textarea>
            
                <v-spacer></v-spacer>
                <v-btn round color="red lighten-2 white--text" @click="dialog = false">Cancel  <v-icon dark right>clear</v-icon></v-btn>
                <v-btn color="light-green lighten-2 white--text" round @click="submit">Add Project <v-icon dark right>check_circle</v-icon> </v-btn>
              </v-form>
              
        
        </v-card-text>

      </v-card>
       
    </v-dialog>


</template>


<script>
import DatabaseService from "../DatabaseService";
import ClickOutside from 'vue-click-outside';
import format from 'date-fns/format'

export default {
  data: () => ({
    dialog: false,
    menu3: true,
    hackathons: null,
    isHackathon: false,
    time: null,
   
    name: "",
    projectType: "",
    endTime: "",
    endDate: "",
    hackathonName: "",
    description: "",
    git: "",
    member: undefined

  }),
  mounted: async function() {
    fetch("http://localhost:8080/projects/scrape")
      .then(response => response.json())
      .then(data => {
        this.hackathons = data;
       
      })
      .then();
       this.member = await DatabaseService.getCurrentUserId()
  },
  computed: {
    formattedDate(){
      return this.endDate ? format(this.endDate, 'MMM Do YYYY'):''
    }
  },
  methods: {
    submit: async function() {
      let proprties = {
        name: this.name,
        projectType: this.projectType,
        endDate: this.endDate,
        endTime: this.endTime,
        hackathonName: this.hackathonName,
        description: this.description,
        git: this.git,
        members:[this.member],
        owners:[this.member]
      };
      //Creates New Project witth fields above
      await DatabaseService.insertProject(proprties);
      this.$emit('project-form-complete');
      
      //Clear form
      this.dialog = false;
      this.name = '';
      this.projectType = '';
      this.endDate = '';
      this.endTime = '';
      this.git = '';
      this.projectType = '';
      this.description = '';
    }
  }
};
</script>