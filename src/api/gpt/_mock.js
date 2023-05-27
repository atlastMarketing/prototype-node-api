const EMPTY_RESULT = {};

const GPT3_MOCKED_RESULT = {
    id: 'cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7',
    object: 'text_completion',
    created: 1589478378,
    model: 'text-davinci-003',
    choices: [
        {
            text: '\n\nThis is indeed a test',
            index: 0,
            logprobs: null,
            finish_reason: 'length',
        },
    ],
    usage: {
        prompt_tokens: 5,
        completion_tokens: 7,
        total_tokens: 12,
    },
};

module.exports = {
    EMPTY_RESULT,
    GPT3_MOCKED_RESULT,
};