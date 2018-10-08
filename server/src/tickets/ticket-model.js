/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tickets', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		number: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		queue_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'queues',
				key: 'id'
			}
		},
		served: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
			defaultValue: '0'
		},
		serving_room: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'rooms',
				key: 'id'
			}
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'tickets'
	});
};
