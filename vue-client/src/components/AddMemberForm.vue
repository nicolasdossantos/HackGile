<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-btn small color="light blue white--text" slot="activator">
      Add Member
    </v-btn>
    <v-card>
      <v-card-title>
        <h2>Add Member</h2>
      </v-card-title>

      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-layout row>
            <v-flex xs12 md12>
              <v-text-field
                prepend-icon="email"
                name="email"
                v-model="email"
                :rules="inputRules"
                label="Member Email:"
            
              ></v-text-field>
            </v-flex>
           
            
          </v-layout>

          <v-spacer></v-spacer>
          <v-btn round color="red lighten-2 white--text" @click="clearForm">
            Cancel
            <v-icon dark right>clear</v-icon>
          </v-btn>
          <v-btn color="light-green lighten-2 white--text" round @click="submit">
            Add Member
            <v-icon dark right>check_circle</v-icon>
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script>
import DatabaseService from "../DatabaseService";


export default {
    name: "AddMemberForm",
  props: {
    id: String
  },
  data: () => ({
    dialog: false,
    email: "",
    inputRules: [v => v.length >= 1 || "Field is required."],
    project: undefined
  }),


  created: function() {
    this.project = this.$props.id;
  },

   methods: {
    submit: async function() {
      
      if (this.$refs.form.validate()) {

        let properties = {
            email: this.email,
            project: this.project,
        };

        //Creates New Project witth fields above
        await DatabaseService.addMember(properties);
        this.clearForm();

        this.$emit("member-form-complete");
      }
    },

    clearForm: function() {
      this.dialog = false;
      email= ""
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