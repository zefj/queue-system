// TODO: typescript
const HttpStatusError = require('common-errors').HttpStatusError;

const logError = (err, req) => {
    /* We log the error internaly */
    if (req.app.get('env') !== 'production') {
        logger.error(`[${err.constructor.name}][${err.status_code}] ${err.message}`);
    } else {
        logger.debug(`[${err.constructor.name}][${err.status_code}] ${err.message}`);
    }

    if (err.status_code >= 500) {
        console.error(err.stack);
    }
};

const errorHandler = (err, req, res, next) => {
    const replacementErr = new HttpStatusError(err, req);
    err.status_code = replacementErr.status_code;

    logError(err, req);

    /*
     * Remove Error's `stack` property. We don't want
     * users to see this at the production env
     */
    if (req.app.get('env') !== 'development') {
        delete err.stack;

        if (err.status_code >= 500) {
            err = replacementErr;
            err.message = HttpStatusError.message_map[500]; //hide the real error from user agent.
        }
    }

    const responseJson = {
        type: err.constructor.name,
        message: err.message,
        stack: err.stack || null,
    };

    if (err.description) {
        responseJson.description = err.description;
    }

    if (err.error) {
        responseJson.error = err.error;
    }

    /* Finally respond to the request */
    res.status(err.status_code || 500).json(responseJson);
};

module.exports = errorHandler;
