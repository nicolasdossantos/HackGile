<template>
  <div class="ProjectCard" v-bind:id="this.$props.id">
    <v-container grid-list-md>
      <v-layout row justify-space-between>
        <v-flex md4>
          <div>
            <v-sheet color="white" min-height="250px">
              <h1 class="text-xs-center">
                Backlog
                <NewStoryForm pid="5ca7a58c1c9d4400006b8cfa"/>
              </h1>
              <Container
                :get-child-payload="getChildPayload"
                @drag-start="onDragStart"
                group-name="containers"
              >
                  <Draggable v-for="story in filterStories()" :key="story._id">
                    <StoryCard v-bind:id="story._id"></StoryCard>
                  </Draggable>
              </Container>
            </v-sheet>
          </div>
        </v-flex>
        <v-flex md8>
          <v-layout column>
            <v-flex md4>
              <v-sheet color="white" min-height="250px">
                <h1 class="text-xs-center">
                  Sprints
                  <NewSprintForm/>
                </h1>

                <Container v-for="sprint in sprints" :key="sprint._id"
                    :get-child-payload="index => getChildPayload(index, sprint._id)"
                    @drag-start="onDragStart"
                    @drop="dropResult => onDrop(dropResult, sprint._id)"
                    group-name="containers"
                >
                  <SprintCard v-bind:id="sprint._id"></SprintCard>
                </Container>
              </v-sheet>
            </v-flex>
            <v-flex md8>
              <v-sheet color="white" min-height="250px">
                <h1 class="text-xs-center">Your Stories</h1>
                <!-- Iterate Stories here -->
                <div>

                </div>
              </v-sheet>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <v-footer app inset height="auto">
      <v-card class="flex green lighten-3" flat tile>
        <v-card-title>
          <strong class="title">Members</strong>
          <AddMemberForm :id="id"/>
        </v-card-title>
        <v-card-actions>
          <v-layout row>
            <v-flex grow>
              <!-- Iterate through members here -->
                <v-item-group multiple center>
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

            </v-flex>
            <v-flex v-if="git" xs1>
              <!-- Shows git link here -->
              <v-list-tile>
                <a :href="git">Access Git Repository</a>
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
import { Container, Draggable } from 'vue-smooth-dnd'
import { applyDrag, generateItems } from '../utils/helpers'
export default {
  name: "ProjectCard",
  components: {
    StoryCard,
    SprintCard,
    NewSprintForm,
    NewStoryForm,
    Container,
    Draggable,
    AddMemberForm
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
      stories: []
    };
  },
 mounted() {
    this.updateProject();
    this.members = this.$store.state.currentProject.members;
  },
  methods: {
    updateProject: function() {
      console.log(this.$store.state.projects);
    },
    modifyProject: function() {},
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
    }
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
    }
  }
};
</script>

<style>
</style>
