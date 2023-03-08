const mongoose = require('mongoose');
const UserProfile = require('./user-profile');

/**
 * Save a new user profile for an instagram account to the atlast mongodb userprofile collection
 * 
 * @param profile The data to create the profile with; must follow the UserProfile schema
 */
async function createProfile(profile) {
    const userProfile = new UserProfile({
        username: username,
        password: password
    });

    await userProfile.save();
}

/**
 * Find a user profile with the given username
 * 
 * @param {string} username The username of the profile
 * @returns A document representing a user profile 
 */
async function findProfile(username) {
    return await UserProfile.findOne({ username: username });
}

/**
 * Delete a user profile with the given username
 * 
 * @param {string} username The username of the profile
 */
async function deleteProfile(username) {
    await UserProfile.deleteOne({ username: username });
}

/**
 * Update a user profile with the given username with the information found in the given newProfile
 * 
 * @param {string} username The original username of the profile
 * @param newProfile The data to update the profile with; must follow the UserProfile schema
 */
async function updateProfile(username, newProfile) {
    // TODO: implement
}
