const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  contentId: { type: String, required: true },
  image_url: { type: String, required: true },
  caption: { type: String, required: true },
  postDate: { type: Date, required: true },
  isDraft: { type: Boolean, required: true }
});

module.exports = mongoose.model('Content', contentSchema);
