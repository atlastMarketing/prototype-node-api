const router = require('express').Router();

const { APIError } = require('../../_error');
const {
    REGULAR_CAMPAIGN_TYPES_ENUM,
    IRREGULAR_CAMPAIGN_TYPES_ENUM,
    SOCIAL_MEDIA_PLATFORMS,
} = require('../../constants/enum');
const { DEFAULT_TIMEZONE } = require('../../constants/defaults');
const {
    dateRecommenderDaily,
    dateRecommenderWeekly,
    dateRecommenderMonthly,
    dateRecommenderEvent,
} = require('./_recommender');

require('dotenv').config();

const DEFAULT_REGULAR_CAMPAIGN_TYPE = REGULAR_CAMPAIGN_TYPES_ENUM.REPEATED_WEEKLY;
const DEFAULT_IRRREGULAR_CAMPAIGN_TYPE = REGULAR_CAMPAIGN_TYPES_ENUM.EVENT;

const generateRegularCampaign = async (req, res) => {
    try {
        const {
            prompt, // required
            prompt_info: promptInfo = {},
            campaign_type: campaignType = DEFAULT_REGULAR_CAMPAIGN_TYPE,
            start_date: startDate, // required
            end_date: endDate = null,
            timezone = DEFAULT_TIMEZONE, // TODO: required
            max_posts: maxPosts = null,
            // TODO: consider business information and prompt
            // meta_user: metaUser = {},
            // meta_business: metaBusiness = {},
            // meta_prompt: metaPrompt = {},
        } = req.body;

        // VALIDATION
        if (!prompt) throw new APIError('Prompt was not given!', 400, 'Bad Request');
        if (!startDate) throw new APIError('Start date was not given!', 400, 'Bad Request');
        // TODO: user auth
        // if (!metaUser) throw new APIError('User not identified!', 403);
        // const {
        //     user_id: userId = 'UNKNOWN_USER',
        // } = metaUser;
        if (!Object.values(REGULAR_CAMPAIGN_TYPES_ENUM).includes(campaignType)) {
            throw new APIError('Campaign type was not recognized!', 400, 'Bad Request');
        }
        if (!startDate) {
            throw new APIError('Start date was not given for regular campaign!', 400, 'Bad Request');
        }

        // FUNCTIONALITY
        const { platform = SOCIAL_MEDIA_PLATFORMS.INSTAGRAM } = promptInfo;
        let campaignData = [];
        if (campaignType === REGULAR_CAMPAIGN_TYPES_ENUM.REPEATED_MONTHLY) {
            campaignData = dateRecommenderMonthly(platform, {
                startDate,
                endDate,
                timezone,
                maxPosts,
            });
        } else if (campaignType === REGULAR_CAMPAIGN_TYPES_ENUM.REPEATED_WEEKLY) {
            campaignData = dateRecommenderWeekly(platform, {
                startDate,
                endDate,
                timezone,
                maxPosts,
            });
        } else if (campaignType === REGULAR_CAMPAIGN_TYPES_ENUM.REPEATED_DAILY) {
            campaignData = dateRecommenderDaily(platform, {
                startDate,
                endDate,
                timezone,
                maxPosts,
            });
        }

        // RETURN
        res.status(200).json(campaignData);
    } catch (err) {
        res.status(err.status || 400).json(err);
    }
};

const generateIrregularCampaign = async (req, res) => {
    try {
        const {
            prompt, // required
            prompt_info: promptInfo = {},
            campaign_type: campaignType = DEFAULT_IRRREGULAR_CAMPAIGN_TYPE,
            start_date: startDate = null,
            end_date: endDate, // required
            timezone = DEFAULT_TIMEZONE, // TODO: required
            max_psts: maxPosts = null,
            // TODO: consider business information and prompt
            // meta_user: metaUser = {},
            // meta_business: metaBusiness = {},
            // meta_prompt: metaPrompt = {},
        } = req.body;

        // VALIDATION
        if (!prompt) throw new APIError('Prompt was not given!', 400, 'Bad Request');
        // TODO: user auth
        // if (!metaUser) throw new APIError('User not identified!', 403);
        // const {
        //     user_id: userId = 'UNKNOWN_USER',
        // } = metaUser;
        if (!Object.values(IRREGULAR_CAMPAIGN_TYPES_ENUM).includes(campaignType)) {
            throw new APIError('Campaign type was not recognized!', 400, 'Bad Request');
        }
        if (campaignType === IRREGULAR_CAMPAIGN_TYPES_ENUM.EVENT && !endDate) {
            throw new APIError('End date was not given for irregular campaign!', 400, 'Bad Request');
        }

        // FUNCTIONALITY
        const { platform = SOCIAL_MEDIA_PLATFORMS.INSTAGRAM } = promptInfo;
        const campaignData = await dateRecommenderEvent(
            platform,
            {
                startDate,
                endDate,
                timezone,
                maxPosts,
            },
        );

        // RETURN
        res.status(200).json(campaignData);
    } catch (err) {
        res.status(err.status || 400).json(err);
    }
};

router.post('/regular', generateRegularCampaign);
router.post('/irregular', generateIrregularCampaign);
module.exports = router;
