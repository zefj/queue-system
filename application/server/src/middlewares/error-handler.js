const HttpStatusError = require('common-errors').HttpStatusError;

const errorHandler = (err, req, res, next) => {
    /* We log the error internaly */
    console.error(`[${err.constructor.name}] ${err.message}`);

    const replacementErr = new HttpStatusError(err, req);
    err.status_code = replacementErr.status_code;

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

    if (err.status_code >= 500) {
        console.error(err.stack);
    }

    /* Finally respond to the request */
    res.status(err.status_code || 500).json({
        type: err.constructor.name,
        message: err.message,
        stack: err.stack || null,
    });
};

module.exports = errorHandler;
