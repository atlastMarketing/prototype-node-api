const express = require('express');
const userProfileManager = require('./user-profile-manager');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
    const profile = req.body;

    /* eslint-disable no-console */
    console.log("Received profile save request:");
    console.log(profile);
    console.log("Saving...");

    await userProfileManager.saveProfile(profile);

    console.log("User Profile was saved successful!");
    /* eslint-enable no-console */
});

router.get('/', async (req, res) => {
    const username = req.body.username;

    /* eslint-disable no-console */
    console.log(`Received profile get request for: ${username}`);
    console.log("Getting...");

    const profile = await userProfileManager.findProfile(username);

    console.log("User Profile was retrieved successful!");
    console.log(profile);
    /* eslint-enable no-console */

    res.json(profile);
});

router.put('/', async (req, res) => {
    const username = req.body.username;
    const update = req.body.update;

    /* eslint-disable no-console */
    console.log(`Received profile update request for: ${username}`);
    console.log(update);
    console.log("Updating...");

    await userProfileManager.updateProfile(username, update);

    console.log("User Profile was updated successful!");
    /* eslint-enable no-console */
});

router.delete('/', async (req, res) => {
    const username = req.body.username;

    /* eslint-disable no-console */
    console.log(`Received profile delete request for: ${username}`);
    console.log("Deleting...");

    await userProfileManager.deleteProfile(username);

    console.log("User Profile was delete successful!");
    /* eslint-enable no-console */
});

router.use('/m1', userProfileManager);  // TODO: correct?

module.exports = router;
