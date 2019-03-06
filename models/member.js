const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Member Schema
let memberSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    image: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    projects: [{
            type: Schema.Types.ObjectId,
             ref: 'Project'
            }]   
});

let Member = module.exports = mongoose.model('Member', memberSchema);