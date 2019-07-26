
<template>
  <v-navigation-drawer
    v-model="drawer"
    class="pb-0"
    floating
    hide-overlay
    stateless
    app
    width="200"
    
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
                <img :src="member.image">
              </v-list-tile-avatar>
              <v-list-tile-action>
                <v-btn
                  icon
                  @click.native.stop="mini = !mini, drawer = false"
                
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
            router
            
            :to="item.route"
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
             
              <v-list-tile-title class="title" center>
  
                   {{window.width}}
              </v-list-tile-title>
              

               
              
              
                
                     
               
            </v-list-tile>
            <v-divider></v-divider>
            <v-flex right>
            <NewProjectForm
              v-on:project-form-complete="$emit('project-form-complete')"
            ></NewProjectForm>
            </v-flex>
             
            
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
  import DatabaseService from '../DatabaseService'
  import NewProjectForm from './NewProjectForm'
  import NewStoryForm from './NewStoryForm'
  import NewSprintForm from './NewSprintForm'

  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Settings', icon: 'settings', route: '/'},
          { title: 'Logout', icon: 'logout', route:'/members/logout' }
        ],
        member : '',
        mini: true,
        right: null,
        window: 0,
        memberID: '',
        window: {
      width: 0,
      height: 0
    }
      }
    },
    
    mounted:async function () {
     this.memberID =  await DatabaseService.getCurrentUserId();
     this.member = await DatabaseService.getMember();
    },
    updated(){
      if(this.window.width < 600){
        this.drawer = false;
      }else{
        this.drawer = true;
      }
    
    },
     created() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
    methods:{
      getUserId: async function() {
        
      },
       handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
      
    },
    components:{
      NewProjectForm,
      NewStoryForm,
      NewSprintForm
    }
  }
</script>

