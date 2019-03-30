const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app.js');
let Project = require('../../models/project');

const router = express.Router();

router.delete('/:id', async (req, res) => {
    const projects = await loadProjectsCollection();
    await projects.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
    res.status(200).send();
})

async function loadProjectsCollection(){
    return app.collection('projects');
}

module.exports = router;