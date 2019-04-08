<template>
    <v-layout
    wrap
    fill-height
    class= "light-green lighten-4"
    
  >
    <Navbar></Navbar>
    <SprintCard id="5ca7ab051c9d44000043c95f"></SprintCard>
    <SprintCard id="5ca7afcf1c9d4400008ef9d2"></SprintCard>
    
    
  </v-layout>
</template>

<script>
  import SprintCard from '../components/SprintCard'
  import Navbar from '../components/Navbar'

  export default {
    components: {
      SprintCard,
      Navbar
    }
  }
</script>

<style scoped>

</style>

