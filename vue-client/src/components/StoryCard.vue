<template>
    <div class="StoryCard pa-2" v-bind:id="this.$props.id">
        <v-card>
            <v-card-title primary-title>
                <h1>
                    {{this.title}}
                </h1>
            </v-card-title>
            <v-card-text>
                <p>
                    {{this.description}}
                </p>
            </v-card-text>
            <v-card-actions>
                <v-list-tile>
                    <v-list-tile-avatar>
                        <v-img
                            v-if="typeof member !== undefined"
                            v-bind:src="fetchImageURL()"
                            max-height=40px
                            max-width=40px
                        >
                        </v-img>
                    </v-list-tile-avatar>
                </v-list-tile>
            </v-card-actions>
        </v-card>
    </div>
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
            member: undefined,
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
                console.log(this.json);
                this.title = this.json.title;
                this.status = this.json.status;
                this.description = this.json.description;
                this.sprint = this.json.sprint;
                //this.json.estimatedTime = estimatedTime;
                this.member = this.json.member;
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
        },
        fetchImageURL: function(){
            if (typeof member == undefined){
                let string = 'require(\'/images/default-user.jpg\')'
                return (string);
            }else{
                if (this.member.provider == 'local'){
                    let string = 'require(\''+this.memberPicture+'\')'
                    return (string);
                }
                else{
                    return this.memberPicture;
                }
            }
        }
    }
}
</script>

<style scoped>

</style>
