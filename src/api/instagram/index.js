const express = require('express');
const Instagram = require('./instagram');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const content = req.body;

    /* eslint-disable no-console */
    console.log("Received post request:");
    console.log(content);
    console.log("Posting...");

    const instagram = await new Instagram(
        process.env.INSTAGRAM_USERNAME,
        process.env.INSTAGRAM_PASSWORD
    );

    await instagram.post(content.imageUrl, content.caption);

    console.log("Post successful!");
    /* eslint-enable no-console */
});

module.exports = router;
