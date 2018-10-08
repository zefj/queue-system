'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    db.createTable('queues', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: 'string',
            length: '255',
            notNull: true,
            unique: true,
        },
        created_at: {
            type: 'timestamp',
            defaultValue: 'CURRENT_TIMESTAMP',
        },
        updated_at: {
            type: 'timestamp',
            defaultValue: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
        }
    }, (err) => {
        if (err) return callback(err);
        return callback();
    });
};

exports.down = function (db) {
    return null;
};

exports._meta = {
    "version": 1
};
