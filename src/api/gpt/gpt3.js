const { Configuration, OpenAIApi } = require('openai');
const router = require('express').Router();

const { handleGPTError, APIError } = require('../../_error');
const { engineerPrompt, calculateTemperature } = require('./_prompt');

require('dotenv').config();

const NUM_OPTIONS_DEFAULT = 3;
const MAX_TOKENS_DEFAULT = 2048;

const configuration = new Configuration({
    apiKey: process.env.GPT3_API_KEY,
});
const openai = new OpenAIApi(configuration);

const _fetchCompletion = async (prompt, options) => {
    try {
        const {
            temperature = 0.6,
            numOptions = NUM_OPTIONS_DEFAULT,
            userId = null,
            maxTokens = MAX_TOKENS_DEFAULT,
        } = options;

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
        const engineeredPrompt = engineerPrompt({
            prompt,
            voice: promptInfo.voice,
            platform: promptInfo.platform,
            businessDescription: metaBusiness.business_description,
            businessLocation: metaBusiness.business_location,
        });

        // completion options

        const temperature = calculateTemperature({
            generationNum: metaPrompt.generation_num,
        });
        console.debug(`Generation number ${metaPrompt.generation_num}, used temperature val: ${temperature}`);

        const completionOptions = {
            temperature,
            numOptions: promptInfo.num_options,
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

router.post('/caption', generateCaption);
module.exports = router;
