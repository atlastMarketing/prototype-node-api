const Instagram = require('instagram-web-api');

require("dotenv").config();

const client = new Instagram(
    {
        username: process.env.INSTAGRAM_USERNAME,
        password: process.env.INSTAGRAM_PASSWORD,
    },
    {
        language: "en-US",
    }
);

async function login() {
    console.log("Logging in...");

    await client.login().then(() => {
        console.log("Login successful!");
    }).catch((err) => {
        console.log("Login failed!");
        console.log(err);
    })
}

module.exports = {
    login,
};
