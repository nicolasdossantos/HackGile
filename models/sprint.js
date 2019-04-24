const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const sprintSchema = new Schema({
  duration: {
    type: Number
  },
  startTime: {
    type: Number
  },
  isStarted: {
    type: Boolean
  },
  stories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Story"
    }
  ]
});

const Sprint = (module.exports = mongoose.model("Sprint", sprintSchema));
