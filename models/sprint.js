const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const sprintSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }]
});

let Sprint = module.exports = mongoose.model('Sprint', sprintSchema);