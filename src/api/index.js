const express = require('express');

const gpt3 = require('./gpt3');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏',
    });
});

router.use('/ml', gpt3);

module.exports = router;
