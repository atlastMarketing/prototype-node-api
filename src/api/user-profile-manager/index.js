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

    const id = await userProfileManager.saveProfile(profile);

    console.log("User Profile was saved successful!");
    /* eslint-enable no-console */

    res.json(id);
});

router.get('/', async (req, res) => {
    const id = req.body.id;

    /* eslint-disable no-console */
    console.log(`Received profile get request for: ${id}`);
    console.log("Getting...");

    const profile = await userProfileManager.findProfile(id);

    console.log("User Profile was retrieved successful!");
    console.log(profile);
    /* eslint-enable no-console */

    res.json(profile);
});

router.put('/', async (req, res) => {
    const id = req.body.id;
    const update = req.body.update;

    /* eslint-disable no-console */
    console.log(`Received profile update request for: ${id}`);
    console.log(update);
    console.log("Updating...");

    await userProfileManager.updateProfile(id, update);

    console.log("User Profile was updated successful!");
    /* eslint-enable no-console */

    res.end();
});

router.delete('/', async (req, res) => {
    const id = req.body.id;

    /* eslint-disable no-console */
    console.log(`Received profile delete request for: ${id}`);
    console.log("Deleting...");

    await userProfileManager.deleteProfile(id);

    console.log("User Profile was deleted successful!");
    /* eslint-enable no-console */

    res.end();
});

module.exports = router;
