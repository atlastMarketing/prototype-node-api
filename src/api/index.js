const express = require('express');

const emojis = require('./emojis');
const Instagram = require('./instagram');

require('dotenv').config();

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.post('/', async (req, res) => {
  const content = req.body;

  /* eslint-disable no-console */
  console.log("Received post request:");
  console.log(content);
  console.log("Posting...");

  const imageUrl = content.imageUrl;
  const caption = content.caption;

  const instagram = await new Instagram(
    process.env.INSTAGRAM_USERNAME,
    process.env.INSTAGRAM_PASSWORD
  );

  await instagram.post(imageUrl, caption);

  console.log("Post successful!");
  /* eslint-enable no-console */
});

router.use('/emojis', emojis);

module.exports = router;
