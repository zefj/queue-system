exports.up = function(knex, Promise) {
    return knex.schema.createTable('queues', (table) => {
        table.increments();
        table.string('name').unique().notNullable();

        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table
            .timestamp('updated_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
            .notNullable();
    });
};

exports.down = function(knex, Promise) {

};
