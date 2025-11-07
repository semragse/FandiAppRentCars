const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define('Setting', {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'string', // string, json, number, boolean
      comment: 'Type de la valeur: string, json, number, boolean'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Description du paramètre'
    }
  }, {
    tableName: 'settings',
    timestamps: true
  });

  return Setting;
};
