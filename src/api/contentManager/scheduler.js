const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
const Content = require('./models/Content');
const Instagram = require('../instagram/instagram');


async function initScheduler(mongo) {

  const db = mongo;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Connected to database');

    const scheduleJobs = [];

    // Create a function to create cron jobs for all the content items
    async function createJobs() {
      const content = await Content.find({ isDraft: false }).exec();
      
      // Stop all existing cron jobs
      scheduleJobs.forEach((job) => job.stop());
      scheduleJobs.length = 0;

      // Create new cron jobs for each content item
      console.log('Creating cron jobs for', content.length, 'content items');
      content.forEach((item) => {
        const job = new CronJob(item.postDate, async () => {
          console.log(`Posting ${item.caption} to ${item.socialMedia}`);
          const instagram = await new Instagram(
            process.env.INSTAGRAM_USERNAME,
            process.env.INSTAGRAM_PASSWORD
        );

        const imageUrl = item.image_url;
        const caption = item.caption;
        try {
          await instagram.post(imageUrl, caption);
          console.log(`Successfully posted ${item.caption}`);
        } catch (error) {
          console.error(`Error posting ${item.caption}:`, error);
        }
        });
        scheduleJobs.push(job);
        job.start();
        console.log(`Cron job created for ${item.caption}`);
      });
    }

    // Create cron jobs for the initial set of content items
    createJobs();

    // Create a cron job to update the scheduled jobs every 5 seconds
    const updateJobsCron = new CronJob('*/5 * * * * *', async () => {
      console.log('Updating scheduled jobs');
      await createJobs();
    });

    // Start the updateJobsCron cron job
    updateJobsCron.start();

  });
}

module.exports = { initScheduler };