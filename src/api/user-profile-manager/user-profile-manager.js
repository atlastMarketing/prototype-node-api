const UserProfile = require('./user-profile');

// TODO: solidify documentation and signatures with final database makeup

/**
 * Save a new user profile for an instagram account to the atlast mongodb userprofile collection
 * 
 * @param profile The user profile to save to the database
 * @throws error if the profile doesn't have a unique username, or the profile is unable to be saved
 */
async function saveProfile(profile) {
    const userProfile = new UserProfile({
        username: profile.username,
        password: profile.password,
    });

    await userProfile.save();
}

/**
 * Find a user profile in the atlast mongodb userprofile collection
 * 
 * @param {string} username The username of the profile
 * @returns The user profile with the given username
 * @throws error if the given username doesn't correspond to any user profile, or the profile was unable to be acquired
 */
async function findProfile(username) {
    return await UserProfile.findOne({ username: username });
}

/**
 * Delete a user profile from the atlast mongodb userprofile collection
 * 
 * @param {string} username The username of the profile
 * @throws error if the given username doesn't correspond to any user profile, or the profile was unable to be acquired
 */
async function deleteProfile(username) {
    await UserProfile.deleteOne({ username: username });
}

/**
 * Update a user profile in the atlast mongodb userprofile collection
 * 
 * @param {string} username The username of the profile to update
 * @param update The data to update the profile with
 * @throws error if the given update doesn't have a username that corresponds to any user profile, or the profile was unable to be updated
 */
async function updateProfile(username, update) {
    const filter = { username: username };
    await UserProfile.findOneAndUpdate(filter, update);
}

module.exports = {
    saveProfile,
    findProfile,
    deleteProfile,
    updateProfile
};
