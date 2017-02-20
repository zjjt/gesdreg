/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reguser', {
    ulogin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mdp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    redac: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'reguser'
  });
};
