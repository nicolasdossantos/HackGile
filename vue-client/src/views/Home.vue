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
    <v-flex xs12>
      <ProjectCard v-bind:id='currentProject'></ProjectCard>
    </v-flex>
    
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
    async beforeCreate() {
      let member = await DatabaseService.getCurrentUserId();
      this.$store.dispatch('updateUser', member);
      this.projects = await this.getProjects().then(() => {
        this.currentProject = this.$store.state.projects[0];
        this.$store.dispatch('updateCurrentProject', this.currentProject);
        this.currentProject = this.currentProject._id;
      });
    },
    created: async function() {

    },
    methods: {
      getProjects: async function(){
        console.log("project form completed.")
        await DatabaseService.getProjectsByMemberId(this.$store.state.user)
        .then((projects) => {
          this.$store.dispatch('updateProjects', projects);
        })
      },
      switchProject: function(projectID){
        alert(projectID);
        if(this.currentProject != projectID){
          this.currentProject = this.$store.state.projects.find((elem) => elem._id == projectID);
          this.$store.dispatch('updateCurrentProject', this.currentProject);
          this.currentProject = this.currentProject._id;
        }
      }
    }
  }
</script>


