const { sequelize, Car, Reservation, PaymentSettings } = require('./models');
const { v4: uuidv4 } = require('uuid');

async function runSeed() {
  try {
    await sequelize.sync({ force: true });
    
    // Cars - Based on available images with appropriate car types
    const cars = [
      { id: 'car1', name: 'Renault Clio 5', price: 35, image: 'images/clio5.jpg', locationAgency: 'Aéroport Tlemcen', carType: 'Citadine' },
      { id: 'car2', name: 'Audi A4', price: 85, image: 'images/audia4.jpg', locationAgency: 'Aéroport Oran', carType: 'Berline' },
      { id: 'car3', name: 'BMW X3', price: 95, image: 'images/BMW X3.jpg', locationAgency: 'Agence Tlemcen', carType: 'SUV' },
      { id: 'car4', name: 'Mercedes CLA 220', price: 120, image: 'images/Mercedes CLA 220.jpg', locationAgency: 'Aéroport Oran', carType: 'Luxe' },
      { id: 'car5', name: 'Dacia Logan', price: 40, image: 'images/Dacia Logan.jpg', locationAgency: 'Aéroport Tlemcen', carType: 'Berline' },
      { id: 'car6', name: 'Ford Focus', price: 50, image: 'images/Ford Focus.jpg', locationAgency: 'Agence Tlemcen', carType: 'Berline' },
      { id: 'car7', name: 'Hyundai i20', price: 38, image: 'images/Hyundai i20.jpg', locationAgency: 'Aéroport Tlemcen', carType: 'Citadine' },
      { id: 'car8', name: 'Peugeot 308', price: 55, image: 'images/Peugeot 308.jpg', locationAgency: 'Aéroport Oran', carType: 'Berline' },
      { id: 'car9', name: 'Seat Ibiza', price: 42, image: 'images/Seat Ibiza.jpg', locationAgency: 'Agence Tlemcen', carType: 'Citadine' },
      { id: 'car10', name: 'Toyota Corolla', price: 60, image: 'images/Toyota Corolla.jpg', locationAgency: 'Aéroport Oran', carType: 'Berline' },
      { id: 'car11', name: 'Volkswagen Golf', price: 52, image: 'images/Volkswagen Golf.jpg', locationAgency: 'Aéroport Tlemcen', carType: 'Berline' }
    ];
    await Car.bulkCreate(cars);
    console.log('✅ Cars seeded');

    // Reservations with payment methods
    const reservations = [
      { 
        id: uuidv4(), 
        carId: 'car1', 
        startDate: '2025-11-10', 
        endDate: '2025-11-12', 
        departureAgency: 'Alger Centre', 
        returnAgency: 'Alger Centre', 
        customerName: 'Ahmed', 
        customerEmail: 'ahmed@example.com', 
        customerPhone: '+212600000001', 
        totalPrice: 35 * 2,
        paymentMethod: 'stripe',
        paymentStatus: 'completed',
        stripePaymentIntentId: 'pi_test_123456789'
      },
      { 
        id: uuidv4(), 
        carId: 'car2', 
        startDate: '2025-11-13', 
        endDate: '2025-11-16', 
        departureAgency: 'Alger Centre', 
        returnAgency: 'Oran', 
        customerName: 'Sara', 
        customerEmail: 'sara@example.com', 
        customerPhone: '+212600000002', 
        totalPrice: 85 * 3,
        paymentMethod: 'paypal',
        paymentStatus: 'pending',
        paypalTransactionId: 'PAYPAL123456',
        paymentNotes: 'En attente de confirmation PayPal'
      }
    ];
    await Reservation.bulkCreate(reservations);
    console.log('✅ Reservations seeded');

    // Payment Settings
    const paymentSettings = {
      // Bank Transfer Info
      bankName: 'Banque Nationale d\'Algérie (BNA)',
      accountHolderName: 'FANDIAUTO SARL',
      iban: 'DZ58 0079 9000 1234 5678 9012',
      bicSwift: 'BNADDZAL',
      bankTransferEnabled: true,
      
      // Stripe Settings (Configure via admin panel or environment variables)
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_public_key',
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_secret_key',
      stripeEnabled: true,
      
      // PayPal Settings
      paypalBusinessEmail: process.env.PAYPAL_BUSINESS_EMAIL || 'business@fandiauto.com',
      paypalInstructions: 'Envoyez votre paiement à notre compte PayPal et incluez votre numéro de réservation dans la note de paiement.',
      paypalEnabled: true
    };
    
    await PaymentSettings.create(paymentSettings);
    console.log('✅ Payment settings seeded');

    console.log('🎉 Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

runSeed();
