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
    db.createTable('tickets', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
        },
        number: {
            type: 'int',
            notNull: true,
        },
        queue_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'ticket_queue_id_fk',
                table: 'queues',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'RESTRICT',
                },
                mapping: 'id',
            }
        },
        served: {
            type: 'boolean',
            defaultValue: false,
        },
        serving_room: {
            type: 'int',
            defaultValue: null,
            foreignKey: {
                name: 'room_id_fk',
                table: 'rooms',
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
        db.addIndex('tickets', 'number_queue_unique', ['number', 'queue_id'], true);
        return callback();
    });
};

exports.down = function (db) {
    return null;
};

exports._meta = {
    "version": 1
};
