process.env.NODE_ENV = 'development'; // todo
console.log(`Starting app in ${process.env.NODE_ENV } mode...`);

const express = require('express');
const app = express();
const router = require('./router');
const bodyParser = require('body-parser');
const Joi = require('joi');
const errors = require('common-errors');

const Bus = require('./bus');

require('./database');

// const mongo = require('./mongo');

// if (process.env.node_env === 'development') {
//     const mongo_express = require('mongo-express/lib/middleware');
//     const mongo_express_config = require('../mongo-express-config.js');
//     app.use('/mongo_express', mongo_express(mongo_express_config))
// }

const allowCrossDomain = require('./middlewares/allow-cross-domain');
const errorHandler = require('./middlewares/error-handler');

app.use(allowCrossDomain);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// This is only temporary
app.use((req, res, next) => {
    req.locals = {
        user: 'temporary-user-until-we-have-auth',
        tenant: 'queue_db',
    };

    next();
});

app.use((req, res, next) => {
    const schema = Joi.object().keys({
        locals: Joi.object().keys({
            user: Joi.string().required(),
            tenant: Joi.string().required(),
        }),
    }).unknown();

    Joi.validate(req, schema, (error) => {
        if (!error) {
            return next();
        }

        throw new errors.ValidationError(error.message);
    });
});

const port = 3000;

app.use(errors.middleware.crashProtector());

app.use('/', router);
app.use(errorHandler);

Bus.registerBusEventHandlers(
    Bus.default,
    [
        require('./tickets/ticket-event-handler').default,
    ]
);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
