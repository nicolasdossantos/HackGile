<template>
  <v-layout fill-height class="light-green lighten-4">
    <v-snackbar v-model="projectAddedSnack" :timeout="4000" top color="info">
      <span>Awesome! You added a project</span>
    </v-snackbar>

    <v-snackbar v-model="memberAddSnack" :timeout="4000" top color="info">
      <span>Member added successfuly!</span>
    </v-snackbar>

    <v-snackbar v-model="sprintDeletedSnack" :timeout="4000" top color="info">
      <span>The sprint was deleted successfuly!</span>
    </v-snackbar>

    <v-snackbar v-model="storyDeletedSnack" :timeout="4000" top color="info">
      <span>The story was deleted successfully!</span>
    </v-snackbar>

    <v-snackbar v-model="storyCreatedSnack" :timeout="4000" top color="info">
      <span>The story was created successfully!</span>
    </v-snackbar>

    <v-snackbar v-model="storyEditedSnack" :timeout="4000" top color="info">
      <span>The story was edited successfully!</span>
    </v-snackbar>

    <v-snackbar v-model="sprintCreatedSnack" :timeout="4000" top color="info">
      <span>The sprint was created successfully!</span>
    </v-snackbar>

    <Navbar v-on:change-project-page="switchProject" v-on:project-form-complete="newProjectAction"></Navbar>
    <!-- <SprintCard id="5ca7ab051c9d44000043c95f"></SprintCard>
    <SprintCard id="5ca7afcf1c9d4400008ef9d2"></SprintCard>-->
    <v-flex xs12 v-if="currentProject != undefined">
      <ProjectCard
        v-bind:id="currentProjectID"
        v-on:story-deleted="storyDeletedAction"
        v-on:story-form-edit="storyEditedAction"
        v-on:story-form-complete="storyCreatedAction"
        v-on:sprint-form-complete="sprintCreatedAction"
        v-on:sprint-deleted="sprintDeletedAction"
        @member-form-complete="memberAddAction"
      ></ProjectCard>
    </v-flex>
  </v-layout>
</template>

<script>
import SprintCard from "../components/SprintCard";
import Navbar from "../components/Navbar";
import DatabaseService from "../DatabaseService";
import ProjectCard from "../components/ProjectCard";

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
      currentProject: undefined,
      currentProjectID: undefined,
      projectAddedSnack: false,
      storyDeletedSnack: false,
      storyEditedSnack: false,
      storyCreatedSnack: false,
      sprintCreatedSnack: false,
      sprintDeletedSnack: false,
      memberAddSnack: false
    };
  },
  async beforeCreate() {
    let member = await DatabaseService.getCurrentUserId();
    this.$store.dispatch("updateUser", member);
    this.projects = await this.getProjects().then(() => {
      this.currentProject = this.$store.state.projects[0];
      this.$store.dispatch("updateCurrentProject", this.currentProject);
      this.currentProjectID = this.currentProject._id;
    });
  },
  created: async function() {},
  methods: {
    getProjects: async function() {
      console.log("project form completed.");
      await DatabaseService.getProjectsByMemberId(this.$store.state.user).then(
        projects => {
          this.$store.dispatch("updateProjects", projects);
        }
      );
      if (this.currentProject !== undefined) {
        this.currentProject = this.$store.state.projects.find(
          elem => elem._id == this.currentProjectID
        );
        this.$store.dispatch("updateCurrentProject", this.currentProject);
      }
    },
    newProjectAction: async function() {
      this.projectAddedSnack = true;
      this.getProjects();
    },
    storyDeletedAction: async function() {
      this.storyDeletedSnack = true;
      this.getProjects();
    },
    storyCreatedAction: async function() {
      this.storyCreatedSnack = true;
      this.getProjects();
    },
    storyEditedAction: async function() {
      this.storyEditedSnack = true;
      this.getProjects();
    },
    sprintCreatedAction: async function() {
      this.sprintCreatedSnack = true;
      this.getProjects();
    },
    sprintDeletedAction: async function() {
      this.sprintDeletedSnack = true;
      this.getProjects();
    },
    memberAddAction: async function() {
      this.memberAddSnack = true;
      this.getProjects();
    },

    switchProject: async function(projectID) {
      //alert(projectID);
      if (this.currentProject != projectID) {
        await this.getProjects();
        let project = await this.$store.state.projects.find(
          elem => elem._id == projectID
        );
        if (project != null) {
          this.currentProject = project;
          this.$store.dispatch("updateCurrentProject", this.currentProject);
          this.currentProjectID = this.currentProject._id;
        } else {
          //Project was probably deleted and does not exist anymore. Tell user
        }
      }
    }
  }
};
</script>


