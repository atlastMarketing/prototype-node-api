const express = require('express');

const campaign = require('./campaign');
const gpt3 = require('./gpt/gpt3');
const instagram = require('./instagram');
const userProfile = require('./user');

require('dotenv').config();

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API v1 - healthy',
    });
});

router.use('/ml', gpt3);
router.use('/campaign', campaign);
router.use('/user', userProfile);
router.use('/instagram', instagram);

module.exports = router;
