exports.up = function(knex, Promise) {
    return knex.schema.createTable('queues', (table) => {
        table.increments();
        table.string('name', 32).unique().notNullable(); // todo: max(32)

        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table
            .timestamp('updated_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
            .notNullable();
    });
};

exports.down = function(knex, Promise) {

};
