let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//project Schema
let projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true
    },
    deadline: {
        type: Number,
    },
    hackathonName: {
        type: String
    },
    description: {
        type: String
    },
    git: {
        type: String
    },
    owners: [{
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }],
    sprints: [{
        type: Schema.Types.ObjectId,
        ref: 'Sprint'
    }],
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }]
});

const Project = module.exports = mongoose.model('Project', projectSchema);