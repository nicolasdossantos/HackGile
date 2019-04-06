<template>
    <v-layout
    wrap
    fill-height
  >
    <Navbar></Navbar>
    <SprintCard id="5ca7ab051c9d44000043c95f"></SprintCard>
    <SprintCard id="5ca7afcf1c9d4400008ef9d2"></SprintCard>
    <Card></Card>
  </v-layout>
</template>

<script>
  import SprintCard from '../components/SprintCard'
  import Navbar from '../components/Navbar'
  import Card from '../components/Card'

  export default {
    components: {
      SprintCard,
      Navbar,
      Card
    }
  }
</script>

