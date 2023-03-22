const express = require('express');
const userProfileManager = require('./user-profile-manager');
require('dotenv').config();
/* eslint no-console: 0 */

const router = express.Router();

router.post('/', async (req, res) => {
    const { body } = req;

    console.log('Received profile save request:');
    console.log(body);
    console.log('Saving...');

    try {
        const id = await userProfileManager.saveProfile(body);

        console.log('User Profile was saved successfully!');
        res.status(201).json(id);
    } catch (err) {
        console.log('User Profile failed to save!');
        res.status(err.status || 400).json(err);
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log(`Received profile get request for: ${userId}`);

    try {
        const profile = await userProfileManager.findProfile(userId, 10);

        console.log('User Profile was retrieved successfully!');
        console.log(profile);
        res.status(200).json(profile);
    } catch (err) {
        console.log('User Profile could not be found!');
        res.status(err.status || 404).json(err);
    }
});

router.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { body } = req;

    console.log(`Received profile update request for: ${userId}`);
    console.log(body);
    console.log('Updating...');

    try {
        await userProfileManager.updateProfile(userId, body);

        console.log('User Profile was updated successful!');
        res.status(204);
    } catch (err) {
        console.log('User Profile failed to update!');
        res.status(err.status || 400).json(err);
    }
});

router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log(`Received profile delete request for: ${userId}`);
    console.log('Deleting...');

    try {
        await userProfileManager.deleteProfile(userId);

        console.log('User Profile was deleted successful!');
        res.status(204);
    } catch (err) {
        console.log('User Profile failed to be deleted!');
        res.status(err.status || 400).json(err);
    }
});

module.exports = router;
