const Sequelize = require('sequelize');

// TODO: consider this https://vivacitylabs.com/setup-typescript-sequelize/

const sequelize = new Sequelize('queue_db', 'app', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

module.exports = sequelize;
