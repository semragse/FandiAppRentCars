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
    },
    // Caractéristiques de la voiture
    seats: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5
    },
    fuelType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Essence SP',
      field: 'fuel_type'
    },
    transmission: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Automatique'
    },
    airConditioning: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'air_conditioning'
    },
    doors: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 5
    }
  }, {
    tableName: 'cars'
  });
  return Car;
};
