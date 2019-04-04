<template>
    
</template>

<script>
import DatabaseService from '../DatabaseService.js';
export default {
    name: 'StoryCard',
    props: {
        id: number
    },
    data: function(){
        return {
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
    async created(){
        updateStory();
    },
    methods: {
        async updateStory(){
            try {
                this.json = await DatabaseService.getStoryById(this.$props.id);
                this.json.title = this.title;
                this.json.status = this.status;
                this.json.description = this.description;
                this.json.project = this.project;
                this.json.sprint = this.sprint;
                //this.json.estimatedTime = estimatedTime;
                this.member = await DatabaseService.getStoryMember(this.project, this.$props.id);
                memberPicture = member.image;
            }catch (err){
                this.title = 'error fetching story';
            }
        },
        async modifyStory(){
            await DatabaseService.updateStory(this.$props.id, {
                title: this.title,
                status: this.status,
                description: this.description,
                project: this.project,
                sprint: this.sprint,
                member: this.member,
                estimatedTime = this.estimatedTime
            });
            updateStory();
        }
    }
}
</script>

<style>

</style>
