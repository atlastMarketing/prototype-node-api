const express = require('express');

const emojis = require('./emojis');
const gpt3 = require('./gpt3');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏',
    });
});

router.use('/emojis', emojis);
router.use('/ml', gpt3);

module.exports = router;
