const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');
const { Schema } = require('mongoose');

const socialMediaCredentialsSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: { // TODO: password isn't even in the database
        type: String,
        required: true,
    },
});

const userProfileSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    instagram: {
        type: socialMediaCredentialsSchema,
        required: false,
    },
    facebook: {
        type: socialMediaCredentialsSchema,
        required: false,
    },
    twitter: {
        type: socialMediaCredentialsSchema,
        required: false,
    },
    business_name: {
        type: String,
        required: false,
    },
    business_type: {
        type: String,
        required: false,
    },
    business_industry: {
        type: String,
        required: false,
    },
    business_description: {
        type: String,
        required: false,
    },
    business_location: {
        type: GeoJSON,
        required: false,
    },
    business_voice: {
        type: String,
        required: false,
    },
    business_url: {
        type: String,
        required: false,
    },
    avatar_image_url: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
