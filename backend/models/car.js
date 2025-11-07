const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Car = sequelize.define('Car', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Emplacement actuel (agence) de la voiture
    locationAgency: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'location_agency'
    }
  }, {
    tableName: 'cars'
  });
  return Car;
};
