const { Configuration, OpenAIApi } = require('openai');
const router = require('express').Router();
const { handleGPTError, APIError } = require('../_error');

require('dotenv').config();

const configuration = new Configuration({
    apiKey: process.env.GPT3_API_KEY,
});

const openai = new OpenAIApi(configuration);

const _fetchCompletion = async (prompt, temperature = 0.6) => {
    try {
        const completion = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            temperature,
        });
        return completion.data;
    } catch (err) {
        return handleGPTError(err);
    }
};

const createCaption = async (req, res) => {
    try {
        const {
            prompt,
        } = req.body;

        // VALIDATION
        if (!prompt) throw new APIError('Prompt was not given!', 400);

        // FETCH GPT3
        const completionData = await _fetchCompletion(
            prompt,
        );

        // RETURN
        res.status(200).json(completionData);
    } catch (err) {
        res.status(err.status || 400).json(err);
    }
};

router.get('/caption', createCaption);
module.exports = router;
