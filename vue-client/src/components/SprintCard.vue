<template>
  <div class="SprintCard pa-2" v-bind:id="this.$props.id">
    <v-card @dblclick="open = true">
      <v-card-title primary-title>
        <v-layout row justify-space-between>
          <v-flex>
            <h1>Sprint {{name}}</h1>
          </v-flex>
          <v-flex align-self-center>
            <v-sheet color="red lighten-3" elevation="4" class="d-flex">
              <h1 class="text-xs-center">Timer</h1>
            </v-sheet>
          </v-flex>
          <v-flex align-self-end>
            <div class="text-xs-right">
              <v-btn flat class="green white--text">
                <h1>Start</h1>
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-card-title>
    </v-card>
    <v-dialog v-model="open" fullscreen>
      <!-- <template v-slot:activator="{ on }">
        <v-btn color="red lighten-2" dark v-on="on">
          <h1>Sprint {{name}}</h1>
        </v-btn>
      </template>-->

      <v-card>
        <v-card-title class="headline red lighten-2" primary-title>
          <v-btn flat @click="open = false">
            <v-icon>close</v-icon>
          </v-btn>
          <h1>Sprint {{name}}</h1>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout row wrap justify-space-between>
              <v-flex md2 v-for="s in status" :key="s">
                <div>
                  <v-sheet color="grey lighten-3" min-height="250px">
                    <h1 class="text-xs-center">{{s}}</h1>
                    <Container
                      :get-child-payload="index => getChildPayload(index, s)"
                      @drag-start="onDragStart"
                      @drop="dropResult => onDrop(dropResult, s)"
                      group-name="status-containers"
                      style="min-height: 200px;"
                    >
                      <Draggable v-for="story in filterStories(s)" :key="story._id">
                        <StoryCard v-bind:id="story._id"></StoryCard>
                      </Draggable>
                    </Container>
                  </v-sheet>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DatabaseService from "../DatabaseService.js";
import StoryCard from "./StoryCard";
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag, generateItems } from "../utils/helpers";
export default {
  name: "SprintCard",
  components: {
    StoryCard,
    Container,
    Draggable
  },
  props: {
    id: String
  },
  data: function() {
    return {
      json: null,
      name: Number,
      stories: [],
      time: Number,
      open: false,
      status: [
        "Unassigned",
        "Assigned",
        "In Progress",
        "Stuck",
        "Testing",
        "Done"
      ]
    };
  },
  mounted: function() {
    this.updateSprint();
  },
  methods: {
    updateSprint: async function() {
      try {
        this.json = await DatabaseService.getSprintById(this.$props.id);
        this.stories = this.json.stories;
        this.time = this.json.time;
      } catch (err) {
        this.error = err;
      }
      let sprints = await this.$store.state.currentProject.sprints;

      for (let i = 0; i < sprints.length; i++) {
        if (sprints[i]._id == this.$props.id) {
          this.name = i + 1;
          break;
        } else {
          this.name = "";
        }
      }
    },
    addStory: function() {},
    filterStories: function(s) {
      return this.stories.filter(function(story) {
        return story.status == s;
      });
    },
    getChildPayload: function(index, status) {
      return this.stories.filter(function(story) {
        return story.status == status;
      })[index];
    },
    onDragStart: function({ index, payload }) {
      //console.log(payload);
    },
    onDrop: function(dropResult, status) {
      if (dropResult.addedIndex !== null){
        console.log(dropResult.payload._id + " " + status);
        this.stories.find(elem => elem._id == dropResult.payload._id).status = status;
      }  
    }
  },
  computed: {},
  watch: {}
};
</script>


