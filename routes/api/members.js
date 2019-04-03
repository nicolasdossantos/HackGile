const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app.js');
let Member = require('../../models/member');

const router = express.Router();

async function loadMembersCollection(){
    return app.collection('members');
}

module.exports = router;