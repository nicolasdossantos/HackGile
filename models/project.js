let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//project Schema
let projectSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    ishackathon:{
        type: String,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    git:{
        type: String,
        required: true
    },
    members:[{
        type: Schema.Types.ObjectId,
        ref: 'Member'
    }],
    sprints:[{
        type: Schema.Types.ObjectId, 
        ref: 'Sprint'}],
    stories:[{
        type: Schema.Types.ObjectId,
        ref: 'Story'}]
});
    
let Project = module.exports = mongoose.model('Project', projectSchema);

