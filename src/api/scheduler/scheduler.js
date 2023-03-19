const CronJob = require('cron').CronJob;
const { generateCaption } = require('../gpt3');

const cronJobs = new Map();

/**
 * Schedules the start of the process to create a new instagram post
 * 
 * @param {string} id The unique id number of the user profile to create posts for
 * @param {string} crontab The cron tab specifying when this schedule will be activated
 * @param {string} timezone The time zone this schedule runs on
 */
function schedule(id, crontab, timezone) {
    cronJobs.set(id, new CronJob(
        crontab,
        () => {
            // TODO: write code to generate the captions and send them to the frontend/get the posting process started
        },
        null,
        true,
        timezone
    ));
}
