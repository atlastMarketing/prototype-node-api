const mongoose = require('mongoose');
const GeoJSON = require('geojson');
const Schema = mongoose.Schema;

const userProfileSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    business_name: {
        type: String,
        required: false
    },
    business_type: {
        type: String,
        required: false
    },
    business_industry: {
        type: String,
        required: false
    },
    business_description: {
        type: String,
        required: false
    },
    business_location: {
        type: GeoJSON,
        required: true
    },
    business_voice: {
        type: String,
        required: false
    }
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
