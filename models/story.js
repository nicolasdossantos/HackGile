let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Story Schema
let storySchema = new Schema({
    title: {
        type: String
    },
    priority: {
        type: String
    },
    status: {
        type: String
    },
    sprint: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint'
    },
   
    member: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    },
    estimatedTime: {
        type: Number
    },
    description: {
        type: String,
    }
});

const Story = module.exports = mongoose.model('Story', storySchema);