const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');
const { Schema } = require('mongoose');

const socialMediaCredentialsSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {  // TODO: password isn't even in the database
        type: String,
        required: true
    }
});

const userProfileSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    instagram: {
        type: socialMediaCredentialsSchema,
        required: true
    },
    facebook: {
        type: socialMediaCredentialsSchema,
        required: true
    },
    twitter: {
        type: socialMediaCredentialsSchema,
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
