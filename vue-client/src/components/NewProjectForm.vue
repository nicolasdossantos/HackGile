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
          <span class="headline">New Project</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field label="Project Name*" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md6>
                <v-select
                  label="Project Type*"
                  :items="['Hackathon Project', 'School Project', 'Personal Project']"
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-autocomplete v-bind:items="hackathons" label="Hackathon Name*" required></v-autocomplete>
              </v-flex>
              <v-layout row wrap>
              <v-flex xs12 sm6 md4>
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
            v-model="date"
            label="Picker without buttons"
            prepend-icon="event"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="date" @input="menu2 = false"></v-date-picker>
      </v-menu>
    </v-flex>
    <v-spacer></v-spacer>
  </v-layout>

            


              <v-layout row wrap>
                <v-flex xs11 sm6>
                  <v-menu
                    ref="menu"
                    v-model="menu2"
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
                        v-model="time"
                        label="End Time"
                        prepend-icon="access_time"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu2"
                      v-model="time"
                      full-width
                      @click:minute="$refs.menu.save(time)"
                    ></v-time-picker>
                  </v-menu>
                </v-flex>
                 </v-layout>
                <v-spacer></v-spacer>
             


              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" type="password" required></v-text-field>
              </v-flex>

              <v-flex xs12 sm6>
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    hackathons: null,
    isHackathon: false,
    time: null,
    menu2: false,
    modal2: false,
    
  }),
  mounted: function() {
    fetch("http://localhost:8080/projects/scrape")
      .then(response => response.json())
      .then(data => {
        this.hackathons = data;
      })
      .then();
  }
};
</script>