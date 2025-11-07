const { sequelize, Car, Reservation } = require('./models');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Sync database
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized\n');

    // Clear existing data
    await Reservation.destroy({ where: {} });
    await Car.destroy({ where: {} });
    console.log('🗑️  Cleared existing data\n');

    // Sample cars with images from the project
    const carsData = [
      {
        id: uuidv4(),
        name: 'Renault Clio 5',
        price: 250,
        image: 'images/clio5.jpg',
        locationAgency: 'Aéroport Tlemcen'
      },
      {
        id: uuidv4(),
        name: 'Dacia Logan',
        price: 200,
        image: 'images/logan.jpg',
        locationAgency: 'Aéroport Oran'
      },
      {
        id: uuidv4(),
        name: 'Peugeot 208',
        price: 280,
        image: 'images/peugeot208.jpg',
        locationAgency: 'Agence Tlemcen'
      },
      {
        id: uuidv4(),
        name: 'Volkswagen Golf',
        price: 350,
        image: 'images/golf.jpg',
        locationAgency: 'Aéroport Tlemcen'
      },
      {
        id: uuidv4(),
        name: 'Toyota Yaris',
        price: 270,
        image: 'images/yaris.jpg',
        locationAgency: 'Aéroport Oran'
      }
    ];

    // Insert cars
    const cars = await Car.bulkCreate(carsData);
    console.log('🚗 Created 5 sample cars:');
    cars.forEach(car => {
      console.log(`  - ${car.name} (${car.price} DH/jour) @ ${car.locationAgency}`);
    });
    console.log('');

    // Helper function to get date string
    function getDateString(daysFromNow) {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      return date.toISOString().split('T')[0];
    }

    // Sample reservations
    const reservationsData = [
      {
        id: uuidv4(),
        carId: cars[0].id, // Renault Clio 5
        startDate: getDateString(5),
        endDate: getDateString(8),
        departureAgency: 'Aéroport Tlemcen',
        returnAgency: 'Agence Tlemcen',
        customerName: 'Ahmed Bennani',
        customerEmail: 'ahmed.bennani@email.com',
        customerPhone: '0661234567',
        totalPrice: 750, // 3 days * 250
        notes: 'Client préférentiel, siège bébé requis',
        documents: JSON.stringify({
          cin: { name: 'cin_ahmed.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_ahmed.jpg', type: 'image/jpeg' }
        })
      },
      {
        id: uuidv4(),
        carId: cars[1].id, // Dacia Logan
        startDate: getDateString(10),
        endDate: getDateString(17),
        departureAgency: 'Agence Tlemcen',
        returnAgency: 'Aéroport Oran',
        customerName: 'Fatima Alaoui',
        customerEmail: 'fatima.alaoui@email.com',
        customerPhone: '0662345678',
        totalPrice: 1400, // 7 days * 200
        notes: 'Voyage familial vers Marrakech',
        documents: JSON.stringify({
          cin: { name: 'cin_fatima.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_fatima.jpg', type: 'image/jpeg' }
        })
      },
      {
        id: uuidv4(),
        carId: cars[2].id, // Peugeot 208
        startDate: getDateString(3),
        endDate: getDateString(5),
        departureAgency: 'Aéroport Oran',
        returnAgency: 'Aéroport Oran',
        customerName: 'Youssef El Amrani',
        customerEmail: 'youssef.amrani@email.com',
        customerPhone: '0663456789',
        totalPrice: 560, // 2 days * 280
        notes: 'Déplacement professionnel',
        documents: JSON.stringify({
          cin: { name: 'cin_youssef.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_youssef.jpg', type: 'image/jpeg' },
          autre: { name: 'attestation_travail.pdf', type: 'application/pdf' }
        })
      },
      {
        id: uuidv4(),
        carId: cars[3].id, // Volkswagen Golf
        startDate: getDateString(15),
        endDate: getDateString(22),
        departureAgency: 'Agence Tlemcen',
        returnAgency: 'Aéroport Tlemcen',
        customerName: 'Khalid Tazi',
        customerEmail: 'khalid.tazi@email.com',
        customerPhone: '0664567890',
        totalPrice: 2450, // 7 days * 350
        notes: 'Retour à l\'aéroport pour vol international',
        documents: JSON.stringify({
          cin: { name: 'cin_khalid.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_khalid.jpg', type: 'image/jpeg' }
        })
      },
      {
        id: uuidv4(),
        carId: cars[4].id, // Toyota Yaris
        startDate: getDateString(7),
        endDate: getDateString(10),
        departureAgency: 'Aéroport Oran',
        returnAgency: 'Aéroport Oran',
        customerName: 'Samira Idrissi',
        customerEmail: 'samira.idrissi@email.com',
        customerPhone: '0665678901',
        totalPrice: 810, // 3 days * 270
        notes: 'Cliente régulière - réduction de 10% appliquée',
        documents: JSON.stringify({
          cin: { name: 'cin_samira.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_samira.jpg', type: 'image/jpeg' }
        })
      }
    ];

    // Insert reservations
    const reservations = await Reservation.bulkCreate(reservationsData);
    console.log('📅 Created 5 sample reservations:');
    reservations.forEach((reservation, index) => {
      const car = cars.find(c => c.id === reservation.carId);
      console.log(`  - ${reservation.customerName}: ${car.name} (${reservation.startDate} → ${reservation.endDate})`);
      console.log(`    ${reservation.departureAgency} → ${reservation.returnAgency} - ${reservation.totalPrice} DH`);
    });
    console.log('');

    // Display summary
    const carCount = await Car.count();
    const reservationCount = await Reservation.count();

    console.log('📊 Database Summary:');
    console.log(`  - Total Cars: ${carCount}`);
    console.log(`  - Total Reservations: ${reservationCount}`);
    console.log('');

    console.log('✅ Database seeding completed successfully!');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
