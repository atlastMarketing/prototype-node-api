const express = require('express');
const mongoose = require('mongoose');

const campaign = require('./campaign');
const gpt3 = require('./gpt/gpt3');
const instagram = require('./instagram');
const userProfileManager = require('./user-profile-manager');
const contentManager = require('./contentManager/routes/content');

require('dotenv').config();

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API v1 - healthy',
    });
});

router.use('/ml', gpt3);
router.use('/campaign', campaign);
router.use('/user', userProfileManager);
router.use('/instagram', instagram);
router.use('/content', contentManager);

module.exports = router;