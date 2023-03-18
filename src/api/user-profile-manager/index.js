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

    try {
        const id = await userProfileManager.saveProfile(profile);

        console.log("User Profile was saved successfully!");
        res.status(200).json(id);
    } catch (err) {
        console.log("User Profile failed to save!");
        res.status(err.status || 400).json(err);
    }
    /* eslint-enable no-console */
});

router.get('/', async (req, res) => {
    const id = req.body.id;

    /* eslint-disable no-console */
    console.log(`Received profile get request for: ${id}`);
    console.log("Getting...");

    try {
        const profile = await userProfileManager.findProfile(id);

        console.log("User Profile was retrieved successfully!");
        console.log(profile);
        res.status(200).json(profile);
    } catch (err) {
        console.log("User Profile was not retrieved!");
        res.status(err.status || 400).json(err);
    }
    /* eslint-enable no-console */
});

router.put('/', async (req, res) => {
    const id = req.body.id;
    const update = req.body.update;

    /* eslint-disable no-console */
    console.log(`Received profile update request for: ${id}`);
    console.log(update);
    console.log("Updating...");

    try {
        await userProfileManager.updateProfile(id, update);

        console.log("User Profile was updated successful!");
        res.status(200);
    } catch (err) {
        console.log("User Profile failed to update!");
        res.status(err.status || 400).json(err);
    }
    /* eslint-enable no-console */
});

router.delete('/', async (req, res) => {
    const id = req.body.id;

    /* eslint-disable no-console */
    console.log(`Received profile delete request for: ${id}`);
    console.log("Deleting...");

    try {
        await userProfileManager.deleteProfile(id);

        console.log("User Profile was deleted successful!");
        res.status(200);
    } catch (err) {
        console.log("User Profile failed to be delete!");
        res.status(err.status || 400).json(err);
    }
    /* eslint-enable no-console */
});

module.exports = router;
