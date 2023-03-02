const express = require('express');

const emojis = require('./emojis');
const instagram = require('./instagram');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.post('/', (req, res) => {
  const content = req.body;

  /* eslint-disable no-console */
  console.log("Received post request:");
  console.log(content);
  console.log("Posting...");

  const imageUrl = content.imageUrl;
  const caption = content.caption;
  instagram.post(imageUrl, caption);

  console.log("Post successful!");
  /* eslint-enable no-console */
});

router.use('/emojis', emojis);

module.exports = router;
