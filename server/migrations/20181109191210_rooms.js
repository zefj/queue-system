exports.up = function(knex, Promise) {
    return knex.schema.createTable('rooms', (table) => {
        table.increments();
        table.string('name', 32).unique().notNullable(); // todo: max(32)

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

exports.down = function(knex, Promise) {

};
