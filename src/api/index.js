const express = require('express');

const gpt3 = require('./gpt3');
const Instagram = require('./instagram');
const userProfileManager = require('./user-profile-manager');

require('dotenv').config();

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API v1 - healthy',
  });
});

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

router.use('/ml', gpt3);
router.use('/user-profile-manager', userProfileManager);

module.exports = router;
