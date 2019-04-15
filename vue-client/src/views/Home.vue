<template>
    <v-layout
    fill-height
    class= "light-green lighten-4"
    
  >
    <Navbar
      v-on:change-project-page="switchProject"
      v-on:project-form-complete="getProjects"
    ></Navbar>
    <!-- <SprintCard id="5ca7ab051c9d44000043c95f"></SprintCard>
    <SprintCard id="5ca7afcf1c9d4400008ef9d2"></SprintCard> -->
    <ProjectCard id="5ca7a58c1c9d4400006b8cfa"></ProjectCard>
    
  </v-layout>
</template>

<script>
  import SprintCard from '../components/SprintCard'
  import Navbar from '../components/Navbar'
  import DatabaseService from '../DatabaseService'
  import ProjectCard from '../components/ProjectCard'

  export default {
    components: {
      SprintCard,
      Navbar,
      ProjectCard
    },
    data: function() {
      return {
        projects: [],
        length: 3,
        currentProject: null,
      }
    },
    created: async function() {
      //TODO: change to logged in user ID
      this.$store.dispatch('updateUser', "5ca7a535dfbbba4a40857710");
      this.projects = await this.getProjects().then(() => {
        this.currentProject = this.$store.state.projects[0];
        this.$store.dispatch('updateCurrentProject', this.currentProject);
      });
    },
    methods: {
      getProjects: async function(){
        await DatabaseService.getProjectsByMemberId(this.$store.state.user)
        .then((projects) => {
          this.$store.dispatch('updateProjects', projects);
        })
      },
      switchProject: function(projectID){
        alert(projectID);
        if(this.currentProject != projectID){
          this.currentProject = projectID;
          this.$store.dispatch('updateCurrentProject', this.currentProject);
        }
      }
    }
  }
</script>


