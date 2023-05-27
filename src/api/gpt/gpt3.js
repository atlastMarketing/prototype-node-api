const { Configuration, OpenAIApi } = require('openai');
const router = require('express').Router();

const { handleGPTError, APIError } = require('../../_error');
const { DEFAULT_TIMEZONE } = require('../../constants/defaults');
const { GPT3_MOCKED_RESULT } = require('./_mock');
const {
    engineerCaptionPrompt,
    engineerSuggestionPrompt,
    calculateTemperature,
} = require('./_prompt');
const { dateRecommenderTodayOrElse } = require('../campaign/_recommender');

require('dotenv').config();

const NUM_OPTIONS_DEFAULT = 3;
const MAX_TOKENS_DEFAULT = 2048;

const configuration = new Configuration({
    apiKey: process.env.GPT3_API_KEY,
});
const openai = new OpenAIApi(configuration);

const AI_MOCK = process.env.AI_ENV === 'mock';

const _fetchCompletion = async (prompt, options) => {
    try {
        const {
            temperature,
            numOptions,
            userId,
            maxTokens,
        } = options;

        if (AI_MOCK) {
            return GPT3_MOCKED_RESULT;
        }

        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            temperature,
            n: numOptions,
            user: String(userId),
            max_tokens: maxTokens,
            // echo: true,
        });
        return completion.data;
    } catch (err) {
        return handleGPTError(err);
    }
};

const generateCaption = async (req, res) => {
    try {
        const {
            prompt,
            prompt_info: promptInfo = {},
            meta_user: metaUser = {},
            meta_business: metaBusiness = {},
            meta_prompt: metaPrompt = {},
        } = req.body;

        // VALIDATION
        if (!prompt) throw new APIError('Prompt was not given!', 400, 'Bad Request');
        // TODO: user auth
        // if (!meta_user) throw new APIError('User not identified!', 403);
        const {
            user_id: userId = 'UNKNOWN_USER',
        } = metaUser;

        // FUNCTIONALITY
        const engineeredPrompt = engineerCaptionPrompt(prompt, {
            voice: promptInfo.voice || metaBusiness.voice || null,
            platform: promptInfo.platform || null,
            businessName: metaBusiness.business_name || null,
            businessDescription: metaBusiness.business_description || null,
            businessLocation: metaBusiness.business_location || null,
        });

        // completion options
        const { generation_num: generationNum = 1 } = metaPrompt;

        const temperature = calculateTemperature({
            generationNum,
        });
        console.debug(`Generation number ${generationNum}, used temperature val: ${temperature}`);

        const { num_options: numOptions = NUM_OPTIONS_DEFAULT } = promptInfo;

        const completionOptions = {
            temperature,
            numOptions,
            userId,
            // TODO: use platform to get maximum number of tokens
            maxTokens: MAX_TOKENS_DEFAULT,
        };

        // FETCH GPT3
        const completionData = await _fetchCompletion(
            engineeredPrompt,
            completionOptions,
        );

        if (!completionData.usage || !completionData.usage.prompt_tokens) {
            throw new APIError('Completion data incomplete! Could not get token usage data.', 500);
        }

        const {
            usage,
            ...completionTask
        } = completionData;
        const token_usage = usage.total_tokens;
        // TODO: save token usage for the given user
        console.debug(`User "${userId}" used up ${token_usage} tokens for the following completion task:\n${JSON.stringify(completionTask, null, 2)}`);

        // RETURN
        res.status(200).json(completionData);
    } catch (err) {
        res.status(err.status || 400).json(err);
    }
};

const NUM_SUGGESTIONS = 5;

const generateSuggestion = async (req, res) => {
    try {
        const {
            prompt_info: promptInfo = {},
            meta_user: metaUser = {},
            meta_business: metaBusiness = {},
            timezone = DEFAULT_TIMEZONE, // TODO: required
            // meta_prompt: metaPrompt = {},
        } = req.body;

        // VALIDATION
        // TODO: user auth
        // if (!meta_user) throw new APIError('User not identified!', 403);
        const {
            user_id: userId = 'UNKNOWN_USER',
        } = metaUser;

        // completion options
        const completionOptions = {
            temperature: 1,
            numOptions: 1,
            userId,
            // TODO: use platform to get maximum number of tokens
            maxTokens: MAX_TOKENS_DEFAULT,
        };

        let totalTokenUsage = 0;

        // CREATE PROMPT AND FETCH GPT3
        const allCompletionData = await Promise.all(
            Array(NUM_SUGGESTIONS).fill(0).map((async () => {
                const engineeredPrompt = engineerSuggestionPrompt({
                    voice: promptInfo.voice || metaBusiness.voice || null,
                    platform: promptInfo.platform || null,
                    businessName: metaBusiness.business_name || null,
                    businessDescription: metaBusiness.business_description || null,
                    businessLocation: metaBusiness.business_location || null,
                });
                const completionData = await _fetchCompletion(
                    engineeredPrompt,
                    completionOptions,
                );
                if (!completionData.usage || !completionData.usage.prompt_tokens) {
                    throw new APIError('Completion data incomplete! Could not get token usage data.', 500);
                }
                const {
                    usage,
                    ...completionTask
                } = completionData;

                totalTokenUsage += usage.total_tokens;
                return completionTask;
            })),
        );
        const recommendedDate = dateRecommenderTodayOrElse(promptInfo.platform, timezone);

        // TODO: save token usage for the given user
        console.debug(`User "${userId}" used up ${totalTokenUsage} tokens for ${NUM_SUGGESTIONS} suggestion captions}`);

        // RETURN
        res.status(200).json({
            date: recommendedDate,
            completions: allCompletionData,
        });
    } catch (err) {
        res.status(err.status || 400).json(err);
    }
};

router.post('/caption', generateCaption);
router.post('/suggestions', generateSuggestion);
module.exports = router;
