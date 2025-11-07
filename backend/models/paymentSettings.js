const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PaymentSettings = sequelize.define('PaymentSettings', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // Bank Transfer Settings
        bankName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        accountHolderName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        iban: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bicSwift: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // Stripe Settings
        stripePublicKey: {
            type: DataTypes.STRING,
            allowNull: true
        },
        stripeSecretKey: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // PayPal Settings
        paypalBusinessEmail: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        paypalInstructions: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: 'Envoyez votre paiement à notre compte PayPal et incluez votre numéro de réservation dans la note.'
        },
        // Payment method availability
        bankTransferEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        stripeEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        paypalEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'payment_settings',
        timestamps: true
    });

    return PaymentSettings;
};
