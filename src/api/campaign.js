const router = require('express').Router();

const { APIError } = require('../_error');
const { REGULAR_CAMPAIGN_TYPES_ENUM, IRREGULAR_CAMPAIGN_TYPES_ENUM } = require('../constants/enum');
const {
    dateRecommenderWeekly,
    dateRecommenderMonthly,
    dateRecommenderEvent,
} = require('./_recommender');

require('dotenv').config();

const DEFAULT_REGULAR_CAMPAIGN_TYPE = REGULAR_CAMPAIGN_TYPES_ENUM.REPEATED_WEEKLY;
const DEFAULT_IRRREGULAR_CAMPAIGN_TYPE = REGULAR_CAMPAIGN_TYPES_ENUM.EVENT;
// const DEFAULT_TIMEZONE = 'America/Vancouver';

const generateRegularCampaign = async (req, res) => {
    try {
        const {
            prompt,
            prompt_info: promptInfo = {},
            campaign_type: campaignType = DEFAULT_REGULAR_CAMPAIGN_TYPE,
            start_date: startDate,
            end_date: endDate,
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
        if (!Object.values(REGULAR_CAMPAIGN_TYPES_ENUM).includes(campaignType)) {
            throw new APIError('Campaign type was not recognized!', 400, 'Bad Request');
        }
        if (!startDate) {
            throw new APIError('Start date was not given for regular campaign!', 400, 'Bad Request');
        }

        // FUNCTIONALITY
        let campaignData = [];
        if (campaignType === REGULAR_CAMPAIGN_TYPES_ENUM.REPEATED_MONTHLY) {
            campaignData = dateRecommenderMonthly(promptInfo.platform, {
                startDate,
                endDate,
            });
        } else if (campaignType === REGULAR_CAMPAIGN_TYPES_ENUM.REPEATED_WEEKLY) {
            campaignData = dateRecommenderWeekly(promptInfo.platform, {
                startDate,
                endDate,
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
            prompt,
            prompt_info: promptInfo = {},
            campaign_type: campaignType = DEFAULT_IRRREGULAR_CAMPAIGN_TYPE,
            start_date: startDate,
            end_date: endDate,
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
        const campaignData = await dateRecommenderEvent(
            promptInfo.platform,
            {
                startDate,
                endDate,
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
