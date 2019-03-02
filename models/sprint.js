
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const sprintSchema = new Schema({
    time: { 
        type: Number,
        required: true },
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'story'}]
});

let Sprint = module.exports = mongoose.model('Sprint', sprintSchema);