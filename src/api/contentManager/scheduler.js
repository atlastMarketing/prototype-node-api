const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
const Content = require('./models/Content');


mongoose.connect('mongodb://localhost/contentManager');

const db = mongoose.connection;
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
      const job = new CronJob(item.postDate, () => {
        console.log(`Posting ${item.caption} to ${item.socialMedia}`);
      });
      scheduleJobs.push(job);
      job.start();
      console.log(`Cron job created for ${item.caption}`);
    });
  }

  // Create cron jobs for the initial set of content items
  createJobs();

  // Listen for changes in the Content model and update the cron jobs accordingly
    // This is not working yet
//   Content.watch().on('change', (change) => {
//     console.log('Database change detected:');
//     createJobs();
//   });

// this is a workaround for the above code not working
  // Create a cron job to update the scheduled jobs every 15 seconds
  const updateJobsCron = new CronJob('*/15 * * * * *', async () => {
    console.log('Updating scheduled jobs');
    await createJobs();
  });

  // Start the updateJobsCron cron job
  updateJobsCron.start();

});
