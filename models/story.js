let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Story Schema
let storySchema = new Schema({
    sprint: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    member: {
        type: String
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

let Story = module.exports = mongoose.model('Story', storySchema);