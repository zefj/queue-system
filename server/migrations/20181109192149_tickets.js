exports.up = function(knex, Promise) {
    return knex.schema.createTable('tickets', (table) => {
        table.increments();
        table.string('tenant', 32).notNullable();

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

exports.down = function(knex, Promise) {

};
