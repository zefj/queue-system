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
    db.createTable('rooms', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: 'string',
            length: '255',
            notNull: true,
        },
        queue_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'room_queue_id_fk',
                table: 'queues',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'RESTRICT',
                },
                mapping: 'id',
            }
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
        db.addIndex('rooms', 'name_queue_unique', ['name', 'queue_id'], true);
        return callback();
    });
};

exports.down = function (db) {
    return null;
};

exports._meta = {
    "version": 1
};
