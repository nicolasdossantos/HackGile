let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Story Schema
let storySchema = new Schema({
    sprint: {
        type: Schema.Types.ObjectId,
        ref: 'Sprint'
    },
    status: {
        type: String
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    },
    title: {
        type: String
    },
    description: {
        type: String,
    },
    priority: {
        type: String
    },
    estimatedTime: {
        type: Number
    }
});

const Story = module.exports = mongoose.model('Story', storySchema);