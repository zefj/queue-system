/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('migrations', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		run_on: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		tableName: 'migrations'
	});
};
