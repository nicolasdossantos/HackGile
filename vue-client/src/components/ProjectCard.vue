<template>
    <div class="ProjectCard" v-bind:id="this.$props.id">
        <v-container grid-list-md>
            <v-layout
                row
                wrap
                justify-space-between
            >
                <v-flex md4>
                    <div>
                        <v-sheet
                            color="grey lighten-3"
                            min-height="250px"
                        >
                        <h1
                            class="text-xs-center"
                        >
                            Backlog
                        </h1>
                            <div v-for="story in filterStories()" :key="story._id">
                                <StoryCard
                                    v-bind:id="story._id"
                                ></StoryCard>
                            </div>
                        </v-sheet>
                    </div>
                </v-flex>
                <v-flex md8>
                    <div>
                        <v-sheet
                            color="grey lighten-3"
                            min-height="250px"
                        >
                        <h1
                            class="text-xs-center"
                        >
                            Sprints
                        </h1>
                            <div v-for="sprints in sprints" :key="sprints._id">
                                <SprintCard
                                    v-bind:id="sprint._id"
                                ></SprintCard>
                            </div>
                        </v-sheet>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import StoryCard from './StoryCard'
import SprintCard from './SprintCard'
export default {
    name: 'ProjectCard',
    components: {
        StoryCard,
        SprintCard
    },
    props: {
        id: String
    },
    data: function(){
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
        }
    },
    created: function(){
        updateProject();
    },
    methods: {
        updateProject: function(){

        },
        modifyProject: function(){
            
        }
    },
    computed:{
        filterStories: function(){
            return this.stories.filter(function(story){
                return story.status == 'Backlog';
            });
        }
    }
}
</script>

<style>

</style>
