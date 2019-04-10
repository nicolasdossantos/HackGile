<template>
    <v-layout
    fill-height
    class= "light-green lighten-4"
    
  >
    <Navbar
      v-on:change-project-page="switchPage(projectID)"
    ></Navbar>
    <SprintCard id="5ca7ab051c9d44000043c95f"></SprintCard>
    <SprintCard id="5ca7afcf1c9d4400008ef9d2"></SprintCard>
    
  </v-layout>
</template>

<script>
  import SprintCard from '../components/SprintCard'
  import Navbar from '../components/Navbar'
  import DatabaseService from '../DatabaseService'

  export default {
    components: {
      SprintCard,
      Navbar
    },
    data: function() {
      return {
        projects: [],
        length: 3
      }
    },
    created: async function() {
      //TODO: change to logged in user ID
      this.$store.dispatch('updateUser', "5ca7a535dfbbba4a40857710");
      this.getProjects();
    },
    methods: {
      getProjects: async function(){
        this.projects = await DatabaseService.getProjectsByMemberId(this.$store.state.user);
        this.$store.dispatch('updateProject', this.projects);
      },
      switchPage(projectID){
        alert(projectID);
      }
    }
  }
</script>

<style scoped>

</style>

