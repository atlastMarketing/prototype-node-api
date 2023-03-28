const UserProfile = require('./user-profile-model');

// TODO: solidify documentation and signatures with final database makeup

/**
 * Save a new user profile for an instagram account to the atlast mongodb userprofile collection
 *
 * @param profile The user profile to save to the database
 * @returns The unique id of the newly saved user profile
 * @throws error if the profile is unable to be saved
 */
async function saveProfile(profile) {
    const userProfile = new UserProfile(profile);
    const { _id: id } = await userProfile.save();
    return id;
}

/**
 * Find a user profile in the atlast mongodb userprofile collection
 *
 * @param {string} id The unique id of the profile
 * @returns The user profile with the given id; null if the id doesn't correspond to any user profile
 * @throws error if the profile was unable to be acquired
 */
async function findProfile(id) {
    return UserProfile.findOne({ _id: id });
}

/**
 * Find a user profile in the atlast mongodb userprofile collection
 *
 * @param {string} email The unique email of the profile
 * @returns The user profile with the given id; null if the id doesn't correspond to any user profile
 * @throws error if the profile was unable to be acquired
 */
async function findProfileByEmail(email) {
    return UserProfile.findOne({ email });
}

/**
 * Delete a user profile from the atlast mongodb userprofile collection
 *
 * @param {string} id The id of the profile
 * @throws error if the given id doesn't correspond to any user profile, or the profile was unable to be acquired
 */
async function deleteProfile(id) {
    await UserProfile.deleteOne({ _id: id });
}

/**
 * Update a user profile in the atlast mongodb userprofile collection
 *
 * @param {string} id The id of the profile to update
 * @param update The data to update the profile with
 * @throws error if the given update doesn't have an id that corresponds to any user profile, or the profile was unable to be updated
 */
async function updateProfile(id, update) {
    const filter = { _id: id };
    await UserProfile.findOneAndUpdate(filter, update);
}

module.exports = {
    saveProfile,
    findProfile,
    deleteProfile,
    updateProfile,
    findProfileByEmail,
};
