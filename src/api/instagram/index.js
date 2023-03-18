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

    const id = body['_id'];
    const instagram = await new Instagram(id);

    const imageUrl = body['image_url'];
    const caption = body['caption'];
    await instagram.post(imageUrl, caption);

    console.log("Post successful!");
    /* eslint-enable no-console */

    res.end();
});

module.exports = router;
