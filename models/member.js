const mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Member Schema
let memberSchema = new Schema({
    nameFirst: {
        type: String,
        required: true
    },
    nameLast: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    projects: [{type: Schema.Types.ObjectId, ref: 'project'}]
   
});

let Member = module.exports = mongoose.model('Member', memberSchema);
