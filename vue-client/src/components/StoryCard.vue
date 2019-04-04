<template>
    <div class="StoryCard"></div>
</template>

<script>
import DatabaseService from '../DatabaseService.js';
export default {
    name: 'StoryCard',
    props: {
        id: String
    },
    data: function(){
        return {
            error: String,
            json: null,
            title: String,
            status: String,
            description: String,
            estimatedTime: '',
            sprint: Number,
            project: Number,
            member: null,
            memberPicture: ''
        }
    },
    created: async function(){
        this.updateStory();
    },
    methods: {
        updateStory: async function(){
            try {
                this.json = await DatabaseService.getStoryById(this.$props.id);
                this.title = this.json.title;
                this.status = this.json.status;
                this.description = this.json.description;
                this.project = this.json.project;
                this.sprint = this.json.sprint;
                //this.json.estimatedTime = estimatedTime;
                this.member = this.json.member.memberPicture;
                this.memberPicture = this.json.member.image;
            }catch (err){
                this.error = err;
            }
        },
        //TODO: Test
        modifyStory: async function(){
            await DatabaseService.updateStory(this.$props.id, {
                title: this.title,
                status: this.status,
                description: this.description,
                project: this.project,
                sprint: this.sprint,
                member: this.member,
                estimatedTime: this.estimatedTime
            });
            this.updateStory();
        }
    }
}
</script>

<style>

</style>
