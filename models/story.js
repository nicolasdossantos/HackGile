let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Story Schema
let storySchema = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    sprint: {
        type: String,
    },
    status: {
        type: String,
        required: true
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
        required: true
    },
    estimatedTime: {
        type: String
    }
});

const Story = module.exports = mongoose.model('Story', storySchema);