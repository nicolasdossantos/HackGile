<template>
    
  <div class="ProjectCard" v-bind:id="this.$props.id">
    
    <v-container grid-list-md>
      <v-layout row>
        <v-flex md4 style="padding-bottom: 10px"> 
          <h1 class="display-2">{{name}}</h1>
        </v-flex>
        <v-flex md4 align-self-center text-xs-center>
             <CountDown :endTime="deadline" />
        </v-flex>
       
        <v-flex md2 offset-md2 align-self-right>
          <v-btn small color="red white--text" @click="deleteDialog = true">Delete Project</v-btn>
        </v-flex>
          <v-dialog v-model="deleteDialog" max-width="290">
              <v-card>
                <v-card-title class="headline">Delete Project?</v-card-title>

                <v-card-text>
                  You are about to delete this project permanently. All data related to this project will be lost. Would you like to proceed?
                  </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn color="green darken-1" flat="flat" @click="deleteDialog = false">Cancel</v-btn>

                  <v-btn color="green darken-1" flat="flat" @click="deleteProject">Delete it!</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
      </v-layout>
      <v-layout row justify-space-between>

        <v-flex md3>
          <div>
            <v-sheet color="white" min-height="250px">
              <h1 class="text-xs-center">
                Backlog
                <NewStoryForm 
                v-bind:pid='this.$props.id'
                v-on:story-form-complete="$emit('story-form-complete')"/>
              </h1>
              <Container
                :get-child-payload="getChildPayload"
                @drag-start="onDragStart"
                group-name="containers"
              >
                  <Draggable v-for="story in filterStories()" :key="story._id">
                    <StoryCard 
                  
                     v-on:story-deleted="$emit('story-deleted')"
                      v-on:story-form-edit="$emit('story-form-edit')"
                    v-bind:id="story._id"></StoryCard>
                  </Draggable>
              </Container>
            </v-sheet>
          </div>
        </v-flex>
        <v-flex md9>
          <v-layout column>
            <v-flex md4>
              <v-sheet color="white" min-height="250px">
                <h1 class="text-xs-center">
                  Sprints
                  <NewSprintForm v-on:sprint-form-complete="$emit('sprint-form-complete')"/>
                </h1>

                <Container v-for="sprint in sprints" :key="sprint._id"
                    :get-child-payload="index => getChildPayload(index, sprint._id)"
                    @drag-start="onDragStart"
                    @drop="dropResult => onDrop(dropResult, sprint._id)"
                    group-name="containers"
                >
                  <SprintCard 
                  v-bind:id="sprint._id"
                  v-on:story-form-complete="$emit('story-form-complete')"
                  v-on:story-form-edit="$emit('story-form-edit')"
                  v-on:sprint-deleted="$emit('sprint-deleted')"
                ></SprintCard>
                </Container>
              </v-sheet>
            </v-flex>
            <v-flex md8>
              <v-sheet color="white" min-height="250px">
                <h1 class="text-xs-center">My Stories</h1>
                <!-- Iterate Stories here -->
                  <v-container fluid grid-list-sm>
                    <v-layout row wrap>
                      <v-flex v-for="story in userStories" :key="story._id" xs4>
                        <StoryCard
                          v-bind:id="story._id"
                          v-on:story-deleted="$emit('story-deleted')"
                          v-on:story-form-edit="$emit('story-form-edit')"
                        ></StoryCard>
                      </v-flex>
                    </v-layout>
                  </v-container>
              </v-sheet>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-footer app inset height="auto">
      <v-card class="flex green lighten-3" flat tile>
         <v-card-title style="padding-bottom:0px; padding-top:10px">
           <v-layout row>
             <v-flex md10>
          <strong class="title">Members</strong>
          <AddMemberForm 
          v-bind:id="this.$props.id"
          @member-form-complete="$emit('member-form-complete')" />
             </v-flex>
             <v-flex md2>
               <h3 v-if="git" class="text-xs-right pr-3 pb-0">Access Your Project</h3>
             </v-flex>
           </v-layout>
        </v-card-title>
        <v-card-actions>
          <v-layout row>
            <v-flex grow>
              <!-- Iterate through members here -->
    <v-item-group multiple center>
        <v-item
          v-for="member in members"
          :key="member._id"
        >
          <v-chip
            close
            :id="member._id"
            @input="removeMember(member._id)"
          >
            <v-avatar>
                <img :src="member.image">
              </v-avatar>
              {{member.firstname + ' ' + member.lastname}}
          </v-chip>
        </v-item>
      </v-item-group>
      

            </v-flex>
            <v-flex v-if="git" xs2 class="pr-5 pb-1">
              <!-- Shows git link here -->
              <v-list-tile>
                <a :href="git" target="_blank">
                  <img :src="gitImage" alt="Git Link" style="height:90%; width:90%"/>
                </a>
              </v-list-tile>
            </v-flex>

          </v-layout>
        </v-card-actions>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
import StoryCard from "./StoryCard";
import SprintCard from "./SprintCard";
import AddMemberForm from "./AddMemberForm";
import DatabaseService from "../DatabaseService";
import NewSprintForm from "./NewSprintForm";
import NewStoryForm from "./NewStoryForm";
import CountDown from "./CountDown";
import { Container, Draggable } from 'vue-smooth-dnd';
import { applyDrag, generateItems } from '../utils/helpers';
export default {
  name: "ProjectCard",
  components: {
    StoryCard,
    SprintCard,
    NewSprintForm,
    NewStoryForm,
    Container,
    Draggable,
    AddMemberForm,
    CountDown
  },
  props: {
    id: String
  },
  data: function() {
    return {
      json: null,
      name: String,
      projectType: String,
      deadline: Number,
      hackathonName: String,
      description: String,
      git: String,
      owners: [],
      members: [],
      sprints: [],
      stories: [],
     gitImage: "./Git-Logo-2Color.png",
      deleteDialog: false,
      

    };
  },
 mounted() {
    this.updateProject();
    this.members = this.$store.state.currentProject.members;
  },
  methods: {
    updateProject: function() {
      //console.log(this.$store.state.projects);
      this.json = this.jsonUpdate;
      this.name = this.json.name;
      this.projectType = this.json.projectType;
      this.deadline = this.json.deadline;
      this.hackathonName = this.json.hackathonName;
      this.git = this.json.git;
      this.stories = this.json.stories;
      this.sprints = this.json.sprints;
      this.members = this.json.members;
      this.owners = this.json.owners;

      let user = this.$store.state.user;
      this.userStories = this.stories.filter(function(obj){
        return (obj.member === user && obj.status != 'Done');
      });
    },
    

    removeMember: async function(id){
      
        let pid = this.$props.id;
        let MemberId = id;

        await DatabaseService.removeMember(pid, MemberId);
        this.$emit('member-removed');
    },

    deleteProject: async function(){
      await DatabaseService.deleteProjectById(this.$props.id);
      console.log("Deleting " + this.$props.id);
      this.$emit('project-deleted');
    },
    filterStories: function() {
      return this.stories.filter(function(story) {
        return story.status == "Backlog";
      });
    },
    getChildPayload: function (index){
    return this.stories.filter(function(story) {
        return story.status == "Backlog";
      })[index];
    },
    onDragStart: function({index, payload}) {
        console.log(payload);
    },
    onDrop: function(dropResult, id) {
      if (dropResult.addedIndex !== null){
        console.log(dropResult.payload._id + " " + id);
        let story = this.stories.find(elem => elem._id == dropResult.payload._id);
        if (story.member){
            story.status = 'Assigned'
        }else{
            story.status = 'Unassigned'
        }
        // Should Modify Database instead of doing this
        story.sprint = id;
        let sprint = this.sprints.find(elem => elem._id == id);
        sprint.stories.push(story._id);
        console.log(story)
        console.log(sprint)
      }  
    }
  },
  computed: {
    //Watches for a change in the vuex projects value
    //Needed because the store isn't retrieved fast enough before mounted is called
    jsonUpdate: function() {
      let id = this.$props.id; //Bringing id into scope
      return this.$store.state.projects.filter(function(obj) {
        return obj._id === id;
      })[0];
    },
  },
  watch: {
    //Watches for a changed in the computed property and executes code
    //Needed because component is instantiated with blank data that isn't instantly filled
    jsonUpdate: function() {
      this.json = this.jsonUpdate;
      this.name = this.json.name;
      this.projectType = this.json.projectType;
      this.deadline = this.json.deadline;
      this.hackathonName = this.json.hackathonName;
      this.git = this.json.git;
      this.stories = this.json.stories;
      this.sprints = this.json.sprints;
      this.members = this.json.members;
      this.owners = this.json.owners;

      let user = this.$store.state.user;
      this.userStories = this.stories.filter(function(obj){
        return (obj.member === user && obj.status != 'Done');
      });
    }
  }
};
</script>

<style>
</style>
