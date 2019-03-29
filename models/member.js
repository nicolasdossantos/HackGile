const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Member Schema
let memberSchema = new Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String
    },
    image: {
        type: String
    },
    provider: {
        type: String
    },
    password: {
        type: String,
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }],
    stories: [{
        type: Schema.Types.ObjectId,
        ref: 'Story'
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

const Member = module.exports = mongoose.model('Member', memberSchema);