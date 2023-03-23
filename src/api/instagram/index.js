const express = require('express');
const Instagram = require('./instagram');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const body = req.body;

    /* eslint-disable no-console */
    console.log("Received post request:");
    console.log(body);
    console.log("Posting...");

    try {
        const instagram = await new Instagram(
            process.env.INSTAGRAM_USERNAME,
            process.env.INSTAGRAM_PASSWORD
        );

        const imageUrl = body['image_url'];
        const caption = body['caption'];
        await instagram.post(imageUrl, caption);

        console.log("Post successful!");
        res.status(200).end();
    } catch (err) {
        console.log("Post failed!");
        res.status(err.status || 400).json(err);
    }
    /* eslint-enable no-console */
});

module.exports = router;
