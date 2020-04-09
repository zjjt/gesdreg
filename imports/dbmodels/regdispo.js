/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('regdispo', {
    wasrg: {
      type: "NUMERIC",
      allowNull: true
    },
    wnrgt: {
      type: "NUMERIC",
      allowNull: true
    },
    wnupo: {
      type: "NUMERIC",
      allowNull: true
    },
    cheque: {
      type: "NUMERIC",
      allowNull: true
    },
    Num_envoi: {
      type: "NUMERIC",
      allowNull: true
    },
    date_depot_treso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_sort_treso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_depot_sign: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_recep_sign_reg: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_retrait_reg: {
      type: DataTypes.DATE,
      allowNull: true
    },
    statut_reg_retirer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    domaine: {
      type: DataTypes.STRING,
      allowNull: true
    },
    redac: {
      type: DataTypes.STRING,
      allowNull: true
    },
    banque: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Comments: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'regdispo'
  });
};
