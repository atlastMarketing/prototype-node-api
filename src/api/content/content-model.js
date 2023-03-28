const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: false,
    },
    caption: {
        type: String,
        required: true,
    },
    post_date: {
        type: Date,
        required: false,
    },
    is_draft: {
        type: Boolean,
        required: true,
    },
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
