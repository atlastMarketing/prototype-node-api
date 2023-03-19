const engineerPrompt = ({
    prompt,
    voice = null,
    platform = null,
    businessDescription = null,
    businessLocation = null,
}) => {
    let finalPrompt = '';

    // METADATA
    if (businessDescription) {
        finalPrompt += 'Use the following description of a business';
        if (businessLocation) finalPrompt += ` located in ${businessLocation}`;
        finalPrompt += ':\n';
        finalPrompt += `"${businessDescription}"\n\n`;
    }

    // PROMPT DETAILS
    // TODO: use platform to get maximum number of chars
    const numChars = 150;
    finalPrompt += `In around ${numChars} characters or less, create a caption`;
    if (platform) finalPrompt += ` for a social media post on "${platform}",`;
    else finalPrompt += ' for a social media post,';
    if (voice) {
        finalPrompt += `using a ${voice} voice,`;
    }
    finalPrompt += ' with the following prompt: \n';

    // USER PROMPT
    finalPrompt += `"${prompt}"\n\n`;

    return finalPrompt;
};

const MAX_TEMPERATURE = 1;
const MIN_TEMPERATURE = 0.3;

const calculateTemperature = ({
    generationNum = 1,
}) => {
    let temperature = MAX_TEMPERATURE;
    // temperature should decrease with more retries (to offer more diverse output)
    //  use 1 / x, which approaches 0 as x -> inf
    temperature -= (1 / generationNum) * (MAX_TEMPERATURE - MIN_TEMPERATURE);

    return temperature;
};

module.exports = {
    calculateTemperature,
    engineerPrompt,
};
