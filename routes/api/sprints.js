const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app.js');
let Sprint = require('../../models/sprint');

const router = express.Router();


router.delete('/:id', async (req, res) => {
    const sprints = await loadSprintsCollection();
    //Should this delete all stories under the sprint?
    await sprints.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)});
    res.status(200).send();
})

async function loadSprintsCollection(){
    return app.collection('sprints');
}

module.exports = router;