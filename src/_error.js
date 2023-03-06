const APIError = class CustomAPIError {
    constructor(message, status = 500, source = 'InternalError') {
        this.name = source;
        this.message = message;
        this.status = status;
        this.date = new Date();
        this.stack = process.env.NODE_ENV === 'production'
            ? 'STACK_HIDDEN'
            : (new Error()).stack;
    }
};

const handleGPTError = (err) => {
    const source = `GPT: (${err.request.method}) ${err.response.statusText}`;
    const statusCode = err.response.status;
    const message = process.env.NODE_ENV === 'production'
        ? 'An error occured while interacting with GPT-3'
        : err.config.data;
    throw new APIError(message, statusCode, source);
};

module.exports = {
    APIError,
    handleGPTError,
};
