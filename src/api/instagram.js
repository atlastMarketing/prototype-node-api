const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');

require('dotenv').config();

async function login() {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.INSTAGRAM_USERNAME);
    await ig.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);
    return ig;
}

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

module.exports = {
    post,
};
