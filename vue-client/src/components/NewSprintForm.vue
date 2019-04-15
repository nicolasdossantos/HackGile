<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-btn small fab dark color="red lighten-2" slot="activator">
      <v-icon dark>add</v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>New Sprint</h2>
      </v-card-title>

      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-layout row>
            <v-flex xs8 md8>
              <v-text-field
                prepend-icon="access_alarm"
                name="duration"
                v-model="duration"
                placeholder="2"
                :rules="inputRules"
                label="Sprint Duration*:"
              ></v-text-field>
            </v-flex>
            <v-flex xs4 md4>
              <v-select
                :items="['Hour[s]', 'Day[s]']"
                name="unit"
                placeholder="Hours"
                v-model="unit"
                :rules="inputRules"
              ></v-select>
            </v-flex>
          </v-layout>

          <v-spacer></v-spacer>
          <v-btn round color="red lighten-2 white--text" @click="clearForm">
            Cancel
            <v-icon dark right>clear</v-icon>
          </v-btn>
          <v-btn color="light-green lighten-2 white--text" round @click="submit">
            Create Sprint
            <v-icon dark right>check_circle</v-icon>
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import DatabaseService from "../DatabaseService";
import format from "date-fns/format";

export default {
  data: () => ({
    dialog: false,
    duration: "",
    unit: "",
    isStarted: false,
    startTime: "",
    stories: [],
    inputRules: [v => v.length >= 1 || "Field is required."],
    project: "",
    calculatedDuration: 0
  }),


  mounted: async function() {
    this.project = this.$store.state.currentProject._id;
  },
   methods: {
    submit: async function() {
      
      if (this.$refs.form.validate()) {

        if(this.unit === 'Hour[s]'){
          this.calculatedDuration = parseFloat(this.duration) * 60 * 60;
        }
        if(this.unit === 'Day[s]'){
            this.calculatedDuration = parseFloat(this.duration) * 24 * 60 * 60;
        }  

        let proprties = {
            duration: this.calculatedDuration,
            project: this.project,
        };

        //Creates New Project witth fields above
        await DatabaseService.insertSprint(proprties);
        this.clearForm();

        this.$emit("sprint-form-complete");
      }
    },

    clearForm: function() {
      this.dialog = false;
      this.duration = "";
      this.unit="";
    }
  }
};
</script>
<style scoped>
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
.alert {
  color: red;
  margin: -10px;
  padding-left: 10px;
  padding-bottom: 10px;
}
.alert-in-enter-active {
  animation: bounce-in 0.5s;
}

.alert-in-leave-active {
  animation: bounce-in 0.5s reverse;
}

v-date-picker {
  color: red;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>