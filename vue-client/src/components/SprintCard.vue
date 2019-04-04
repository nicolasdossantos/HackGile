<template>
    
</template>

<script>
import DatabaseService from '../DatabaseService.js';
export default {
    name: SprintCard,
    props: {
        id: String
    },
    data: function(){
        return {
            json: null,
            name: string,
            stories: null,
            time: Number
        }
    },
    created: function(){
        //updateSprint();
    },
    methods: {
        updateSprint: function(){
            try {
                this.json = await DatabaseService.getSprintById(this.$props.id);
                this.name = this.json.name;
                this.stories = this.json.stories;
                this.time = this.json.time;
            }catch (err){
                this.error = err;
            }
        },
        modifySprint: function(){
            
        }
        //TODO: Implement Draggable
    }
}
</script>

<style>

</style>
