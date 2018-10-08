const ENV = 'development'; // todo

const express = require('express');
const app = express();
// const router = express.Router();
const router = require('./router');
const bodyParser = require('body-parser');
const Joi = require('joi');
const errors = require('common-errors');

// const mongo = require('./mongo');

if (ENV === 'development') {
    const mongo_express = require('mongo-express/lib/middleware');
    const mongo_express_config = require('../mongo-express-config.js');
    app.use('/mongo_express', mongo_express(mongo_express_config))
}

const allowCrossDomain = require('./middlewares/allow-cross-domain');
const errorHandler = require('./middlewares/error-handler');

app.use(allowCrossDomain);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// This is only temporary
// Each client will have his own schema
app.use((req, res, next) => {
    req.session = {
        user: 'temporary-user-until-we-have-auth'
    };
    next();
});

app.use((req, res, next) => {
    const schema = Joi.object().keys({
        user: Joi.string().required(),
    });

    Joi.validate(req.session, schema, (error) => {
        if (!error) {
            return next();
        }

        throw new errors.ValidationError(error.message);
    });
});

const port = 3000;

const sequelize = require('./database');

sequelize.authenticate()
    .then(() => {
        // mongo.connect()
        //     .then((db) => {
        app.use(errors.middleware.crashProtector());

        app.use('/', router);
        app.use(errorHandler);

        app.listen(port, () => {
            console.log(`App listening on port ${port}!`);
        });
            // });
    })
    .catch((error) => {
        console.error(error);
    });
