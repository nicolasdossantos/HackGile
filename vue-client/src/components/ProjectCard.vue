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
              <div v-for="story in filterStories()" :key="story._id">
                <StoryCard v-bind:id="story._id"></StoryCard>
              </div>
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

                <div v-for="sprint in sprints" :key="sprint._id">
                  <SprintCard v-bind:id="sprint._id"></SprintCard>
                </div>
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
        </v-card-title>
        <v-card-actions>
          <v-layout row>
            <v-flex grow>
              <!-- Iterate through members here -->
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-img
                    src="https://randomuser.me/api/portraits/men/85.jpg"
                    max-height="40px"
                    max-width="40px"
                  ></v-img>
                </v-list-tile-avatar>
              </v-list-tile>
            </v-flex>
            <v-flex v-if="git" xs1>
              <!-- Shows git link here -->
              <v-list-tile>
                <v-list-tile-avatar>
                  <v-img
                    src="https://randomuser.me/api/portraits/men/85.jpg"
                    max-height="40px"
                    max-width="40px"
                  ></v-img>
                </v-list-tile-avatar>
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
import DatabaseService from "../DatabaseService";
import NewSprintForm from "./NewSprintForm";
import NewStoryForm from "./NewStoryForm";
export default {
  name: "ProjectCard",
  components: {
    StoryCard,
    SprintCard,
    NewSprintForm,
    NewStoryForm
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
  mounted: function() {
    this.updateProject();
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
