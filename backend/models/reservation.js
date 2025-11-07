const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reservation = sequelize.define('Reservation', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    carId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Agence de départ de la réservation
    departureAgency: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'departure_agency'
    },
    // Agence de retour de la réservation
    returnAgency: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'return_agency'
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    documents: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Flag interne pour indiquer que le mouvement de la voiture a été appliqué après fin de réservation
    movementApplied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'movement_applied'
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'reservations'
  });
  return Reservation;
};
