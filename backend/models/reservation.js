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
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'pending', // pending, accepted, refused
    },
    // Payment information
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      // 'stripe', 'paypal', 'bank_transfer'
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'pending', // pending, completed, failed
    },
    // PayPal specific
    paypalTransactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paypalScreenshot: {
      type: DataTypes.TEXT, // base64 image
      allowNull: true,
    },
    // Stripe specific
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Bank transfer specific
    bankTransferReceipt: {
      type: DataTypes.TEXT, // base64 image
      allowNull: true,
    },
    // General payment notes
    paymentNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
