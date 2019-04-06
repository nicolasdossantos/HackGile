const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const sprintSchema = new Schema({
    name: {
        type: String,
    },
    time: {
        type: Number,
    },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }]
});

const Sprint = module.exports = mongoose.model('Sprint', sprintSchema);