<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn fab dark small color="cyan" v-on="on">
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
                <v-text-field name="name" label="Project Name*" required></v-text-field>
              </v-flex>
               <v-flex xs12 sm12>
                <v-select
                  :items="['Hackathon', 'School Project', 'Personal Project']"
                  label="Project Type*"
                  required
                ></v-select>
              </v-flex>
             <v-flex xs12 md12>
        <v-textarea
          name="input-7-1"
          label="Project Description"
          value=""
          hint="Hint text"
        ></v-textarea>
      </v-flex>
      
              <v-flex xs12 sm12 md12>
                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
              </v-flex>
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
      dialog: false
    })
  }
</script>