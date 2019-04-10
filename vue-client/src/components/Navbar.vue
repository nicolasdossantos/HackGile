<template>
  <v-navigation-drawer
    v-model="drawer"
    class="pb-0"
    floating
    hide-overlay
    stateless
    app
    width="300"
    
  >
    <v-layout fill-height>
      <v-navigation-drawer
        class = "red lighten-2"
        mini-variant
        stateless
        value="true"
      >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile>
              <v-list-tile-avatar>
                <img src="https://randomuser.me/api/portraits/men/85.jpg">
              </v-list-tile-avatar>
              <v-list-tile-action>
                <v-btn
                  icon
                  @click.native.stop="mini = !mini"
                >
                  <v-icon>chevron_left</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-toolbar>

        <v-list class="pt-0" dense>
          <v-divider></v-divider>

          <v-list-tile
            v-for="item in items"
            :key="item.title"
            @click=""
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>  
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    
        <v-list>
          
            <v-list-tile>
               <NewProjectForm></NewProjectForm>
               <br>
                <v-list-tile-title class="title">
                     &nbsp; Projects
                </v-list-tile-title>
            </v-list-tile>
            <v-divider></v-divider>
            <v-list>
                <v-list-tile
                  v-for="project in this.$store.state.projects"
                  :key="project._id"
                  v-on:click="$emit('change-project-page', project._id)"
                >
                    <v-list-tile-title>
                        {{project.name}}
                    </v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-list>
        
    </v-layout>
  </v-navigation-drawer>
</template>

<script>

  import NewProjectForm from '../components/NewProjectForm'

  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ],
        mini: true,
        right: null,
        window: 0
      }
    },
    components:{
      NewProjectForm
    }
  }
</script>

<style>

</style>
