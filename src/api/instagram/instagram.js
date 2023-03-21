const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const userProfileManager = require('../user-profile-manager/user-profile-manager');


/**
 * An API client for a specific Instagram account
 */
class Instagram {
    /**
     * Initializes the class
     * 
     * @param {string} id The id of the user profile containing the instagram account to login to
     * @returns {Promise<Instagram>} A promise of an initialized instance of this class
     */
    constructor(id) {
        this.client = new IgApiClient();    // TODO: make client private

        return new Promise(async (resolve) => {
            const userProfile = await userProfileManager.findProfile(id);
            const username = userProfile.username;  // TODO: these should be replaced with an api key
            const password = userProfile.password;

            this.client.state.generateDevice(username);
            await this.client.account.login(username, password);
            resolve(this);
        });
    }

    /**
     * Create a new instagram post
     * 
     * Example:
     * 
     * post("https://images.unsplash.com/photo-1533450718592-29d45635f0a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8anBnfGVufDB8fDB8fA%3D%3D&w=1000&q=80", "My post.");
     * 
     * @param {string} imageUrl The location of the jpg image to post 
     * @param {string} caption The caption of the post
     */
    async post(imageUrl, caption) {
        const imageBuffer = await get({
            url: imageUrl,
            encoding: null,
        });

        await this.client.publish.photo({
            file: imageBuffer,
            caption: caption,
        });
    }
}

module.exports = Instagram;
