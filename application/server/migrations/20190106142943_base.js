exports.up = function(knex, Promise) {
    const createTenants = () => {
        return knex.schema.createTable('tenants', (table) => {
            table.string('id', 36).notNullable().primary();
            table.string('name', 32).notNullable();

            table.unique(['id', 'name']);

            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
                .notNullable();
        });
    };

    const createQueues = () => {
        return knex.schema.createTable('queues', (table) => {
            table.increments();
            table.string('tenant', 36).notNullable();
            table
                .foreign('tenant')
                .references('id')
                .inTable('tenants')
                .onDelete('CASCADE');

            table.string('name', 32).notNullable();

            table.unique(['name', 'tenant']);
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
                .notNullable();
        });
    };

    const createRooms = () => {
        return knex.schema.createTable('rooms', (table) => {
            table.increments();
            table.string('tenant', 36).notNullable();
            table
                .foreign('tenant')
                .references('id')
                .inTable('tenants')
                .onDelete('CASCADE');

            table.string('name', 32).notNullable();

            table.unique(['name', 'tenant']);
            table.integer('queue_id').unsigned().notNullable();
            table
                .foreign('queue_id')
                .references('id')
                .inTable('queues')
                .onDelete('CASCADE');

            table.unique(['name', 'queue_id']);

            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
                .notNullable();
        });
    };

    const createTickets = () => {
        return knex.schema.createTable('tickets', (table) => {
            table.increments();
            table.string('tenant', 36).notNullable();
            table
                .foreign('tenant')
                .references('id')
                .inTable('tenants')
                .onDelete('CASCADE');

            table.string('number', 11).notNullable();
            table.integer('queue_id').unsigned().notNullable();
            table
                .foreign('queue_id')
                .references('id')
                .inTable('queues')
                .onDelete('CASCADE');

            table.boolean('served').defaultTo(false);

            table.unique(['number', 'queue_id']);

            table.integer('serving_room').unsigned();
            table
                .foreign('serving_room')
                .references('id')
                .inTable('rooms')
                .onDelete('CASCADE');

            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
            table
                .timestamp('updated_at')
                .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
                .notNullable();
        });
    };

    return createTenants()
        .then(createQueues)
        .then(createRooms)
        .then(createTickets);
};

exports.down = function(knex, Promise) {

};
