const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');

require('dotenv').config();

/**
 * Login to an instagram account with the environment credentials
 * 
 * @returns {IgApiClient} The instagram api client
 */
async function login() {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);
    await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
    return ig;
}

/**
 * Create a new instagram post after logging in with the env credentials
 * 
 * @param {string} imageUrl The location of the jpg image to post 
 * @param {string} caption The caption of the post 
 */
async function post(imageUrl, caption) {
    const ig = await login();

    const imageBuffer = await get({
        url: imageUrl,
        encoding: null,
    });

    await ig.publish.photo({
        file: imageBuffer,
        caption: caption,
    });
}

/**
 * Example of post:
 * 
 * post("https://images.unsplash.com/photo-1533450718592-29d45635f0a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8anBnfGVufDB8fDB8fA%3D%3D&w=1000&q=80", "My post.");
 */

module.exports = {
    post,
};
