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
                            <div v-for="story in filterStories()" :key="story._id">
                                <StoryCard
                                    v-bind:id="story._id"
                                ></StoryCard>
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

        }
    },
    created: function(){
        updateProject();
    },
    methods: {
        updateProject: function(){

        },
        modifyProject: function(){
            
        },
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
