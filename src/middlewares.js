const { APIError } = require('./_error');

function notFound(req, res, next) {
    const error = new APIError(`URL Not Found - ${req.originalUrl}`, 501, 'API Error');
    next(error);
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
    /* eslint-enable no-unused-vars */
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    if (err instanceof APIError) {
        res.status(err.status).json(err);
    } else {
        res.status(statusCode).json(new APIError(err.message));
    }
}

module.exports = {
    notFound,
    errorHandler,
};
