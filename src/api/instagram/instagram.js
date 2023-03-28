const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');

/**
 * An API client for a specific Instagram account
 */
class Instagram {
    /**
     * Initializes the class
     * 
     * @param {string} username The username of the user profile containing the instagram account to login to
     * @param {string} password The password of the user profile containing the instagram account to login to
     * @returns {Promise<Instagram>} A promise of an initialized instance of this class
     */
    constructor(username, password) {
        this.client = new IgApiClient();    // TODO: make client private

        return new Promise(async (resolve) => {
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
