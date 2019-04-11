<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn small fab dark color="indigo" v-on="on">
          <v-icon dark>add</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title>
          <span class="headline">New Story</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-form md12 sm12>
                <v-flex>
                  <v-text-field label="Story Title*" name="title" v-model="title"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-select
                    label="Priority*"
                    :items="['High', 'Moderate', 'Low']"
                    name="priority"
                    v-model="priority"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-autocomplete
                    v-bind:items="members"
                    label="Hackathon Name*"
                    name="hackathonName"
                    v-model="hackathonName"
                  ></v-autocomplete>
                </v-flex>
                <v-layout row wrap>
                  <v-flex xs12 sm6 md6>
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          label="End Date"
                          :value="endDate"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker name="endDate" v-model="endDate" @input="menu2 = false"></v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-spacer></v-spacer>
                </v-layout>

                <v-layout row wrap>
                  <v-flex xs12 sm6 md6 lg6>
                    <v-menu
                      ref="menu"
                      v-model="menu3"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="time"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="endTime"
                          label="End Time"
                          prepend-icon="access_time"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menu3"
                        v-model="endTime"
                        full-width
                        name="endTime"
                        @click:minute="$refs.menu.save(time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
                <v-spacer></v-spacer>
                <v-flex xs12>
                  <v-text-field name="git" v-model="git" label="Git Repository"></v-text-field>
                </v-flex>

                <v-flex xs12 md12>
                  <v-textarea
                    name="description"
                    v-model="description"
                    label="Project Description"
                    hint="Plese describe your project."
                  ></v-textarea>
                </v-flex>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="submit">Add Project</v-btn>
              </v-form>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions></v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import DatabaseService from "../DatabaseService";

export default {
  data: () => ({
    dialog: false,
    members: [],
    isHackathon: false,
    time: null,
    menu2: false,
    menu3: false,
    modal2: false,

    sprint: undefined,
    status: '',
    member: undefined,
    title: '',
    description: '',
    priority: '',
    estimatedTime: 0
  }),

  mounted: function() {
    fetch("http://localhost:8080/api/projects/5ca7a58c1c9d4400006b8cfa/members")
      .then(data => {
        console.log(data);
        data.forEach((member) => {
            this.members.push(member.firstname)
        })
        
      })
      .then();
      
  },
  
  methods: {
    submit: async function() {
      let proprties = {
        sprint: this.sprint,
        status: this.status,
        member: this.member,
        title: this.title,
        priority: this.priority,
        description: this.description,
        estimatedTime: this.estimatedTime
      };
      //Creates New Story witth fields above
      await DatabaseService.insertStory(proprties);
      
      //Clear form
      this.dialog = false;
      this.sprint = undefined;
      this.status = '';
      this.estimatedTime = '';
      this.priority = '';
      this.description = '';
      this.title = '';
      this.member = undefined;

    }
  }
};
</script>