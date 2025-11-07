const { sequelize, Car, Reservation } = require('./models');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Sync database with force to recreate tables
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized\n');

    // Sample cars with images from the project
    const carsData = [
      {
        id: uuidv4(),
        name: 'Renault Clio 5',
        price: 250,
        image: 'images/clio5.jpg',
        locationAgency: 'Aéroport Tlemcen',
        seats: 5,
        fuelType: 'Essence SP',
        transmission: 'Automatique',
        airConditioning: true,
        doors: 5
      },
      {
        id: uuidv4(),
        name: 'Audi A4',
        price: 450,
        image: 'images/audia4.jpg',
        locationAgency: 'Aéroport Oran',
        seats: 5,
        fuelType: 'Diesel',
        transmission: 'Automatique',
        airConditioning: true,
        doors: 4
      },
      {
        id: uuidv4(),
        name: 'Volkswagen Golf',
        price: 320,
        image: 'images/Volkswagen Golf.jpg',
        locationAgency: 'Agence Tlemcen',
        seats: 5,
        fuelType: 'Essence SP',
        transmission: 'Automatique',
        airConditioning: true,
        doors: 5
      },
      {
        id: uuidv4(),
        name: 'Peugeot 308',
        price: 280,
        image: 'images/Peugeot 308.jpg',
        locationAgency: 'Aéroport Tlemcen',
        seats: 5,
        fuelType: 'Diesel',
        transmission: 'Manuelle',
        airConditioning: true,
        doors: 5
      },
      {
        id: uuidv4(),
        name: 'Toyota Corolla',
        price: 350,
        image: 'images/Toyota Corolla.jpg',
        locationAgency: 'Aéroport Oran',
        seats: 5,
        fuelType: 'Hybride',
        transmission: 'Automatique',
        airConditioning: true,
        doors: 4
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

    // Sample reservations - 2 per car
    const reservationsData = [
      // Renault Clio 5 - Reservation 1
      {
        id: uuidv4(),
        carId: cars[0].id,
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
      // Renault Clio 5 - Reservation 2
      {
        id: uuidv4(),
        carId: cars[0].id,
        startDate: getDateString(12),
        endDate: getDateString(15),
        departureAgency: 'Agence Tlemcen',
        returnAgency: 'Aéroport Tlemcen',
        customerName: 'Nadia Hamdi',
        customerEmail: 'nadia.hamdi@email.com',
        customerPhone: '0665555111',
        totalPrice: 750, // 3 days * 250
        notes: 'Réservation pour vacances',
        documents: JSON.stringify({
          cin: { name: 'cin_nadia.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_nadia.jpg', type: 'image/jpeg' }
        })
      },
      // Audi A4 - Reservation 1
      {
        id: uuidv4(),
        carId: cars[1].id,
        startDate: getDateString(7),
        endDate: getDateString(10),
        departureAgency: 'Aéroport Oran',
        returnAgency: 'Aéroport Oran',
        customerName: 'Karim Benali',
        customerEmail: 'karim.benali@email.com',
        customerPhone: '0662345678',
        totalPrice: 1350, // 3 days * 450
        notes: 'Voyage d\'affaires',
        documents: JSON.stringify({
          cin: { name: 'cin_karim.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_karim.jpg', type: 'image/jpeg' }
        })
      },
      // Audi A4 - Reservation 2
      {
        id: uuidv4(),
        carId: cars[1].id,
        startDate: getDateString(18),
        endDate: getDateString(25),
        departureAgency: 'Aéroport Oran',
        returnAgency: 'Agence Tlemcen',
        customerName: 'Sophia Mansouri',
        customerEmail: 'sophia.mansouri@email.com',
        customerPhone: '0666777888',
        totalPrice: 3150, // 7 days * 450
        notes: 'Location longue durée',
        documents: JSON.stringify({
          cin: { name: 'cin_sophia.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_sophia.jpg', type: 'image/jpeg' }
        })
      },
      // Volkswagen Golf - Reservation 1
      {
        id: uuidv4(),
        carId: cars[2].id,
        startDate: getDateString(3),
        endDate: getDateString(6),
        departureAgency: 'Agence Tlemcen',
        returnAgency: 'Agence Tlemcen',
        customerName: 'Youssef El Amrani',
        customerEmail: 'youssef.amrani@email.com',
        customerPhone: '0663456789',
        totalPrice: 960, // 3 days * 320
        notes: 'Déplacement professionnel',
        documents: JSON.stringify({
          cin: { name: 'cin_youssef.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_youssef.jpg', type: 'image/jpeg' }
        })
      },
      // Volkswagen Golf - Reservation 2
      {
        id: uuidv4(),
        carId: cars[2].id,
        startDate: getDateString(20),
        endDate: getDateString(23),
        departureAgency: 'Agence Tlemcen',
        returnAgency: 'Aéroport Tlemcen',
        customerName: 'Malika Cherif',
        customerEmail: 'malika.cherif@email.com',
        customerPhone: '0667788999',
        totalPrice: 960, // 3 days * 320
        notes: 'Week-end familial',
        documents: JSON.stringify({
          cin: { name: 'cin_malika.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_malika.jpg', type: 'image/jpeg' }
        })
      },
      // Peugeot 308 - Reservation 1
      {
        id: uuidv4(),
        carId: cars[3].id,
        startDate: getDateString(8),
        endDate: getDateString(12),
        departureAgency: 'Aéroport Tlemcen',
        returnAgency: 'Aéroport Tlemcen',
        customerName: 'Rachid Tazi',
        customerEmail: 'rachid.tazi@email.com',
        customerPhone: '0664567890',
        totalPrice: 1120, // 4 days * 280
        notes: 'Voyage touristique',
        documents: JSON.stringify({
          cin: { name: 'cin_rachid.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_rachid.jpg', type: 'image/jpeg' }
        })
      },
      // Peugeot 308 - Reservation 2
      {
        id: uuidv4(),
        carId: cars[3].id,
        startDate: getDateString(16),
        endDate: getDateString(19),
        departureAgency: 'Aéroport Tlemcen',
        returnAgency: 'Agence Tlemcen',
        customerName: 'Leila Amrani',
        customerEmail: 'leila.amrani@email.com',
        customerPhone: '0668899000',
        totalPrice: 840, // 3 days * 280
        notes: 'Conférence professionnelle',
        documents: JSON.stringify({
          cin: { name: 'cin_leila.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_leila.jpg', type: 'image/jpeg' }
        })
      },
      // Toyota Corolla - Reservation 1
      {
        id: uuidv4(),
        carId: cars[4].id,
        startDate: getDateString(4),
        endDate: getDateString(7),
        departureAgency: 'Aéroport Oran',
        returnAgency: 'Aéroport Oran',
        customerName: 'Omar Idrissi',
        customerEmail: 'omar.idrissi@email.com',
        customerPhone: '0665678901',
        totalPrice: 1050, // 3 days * 350
        notes: 'Client VIP - service premium',
        documents: JSON.stringify({
          cin: { name: 'cin_omar.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_omar.jpg', type: 'image/jpeg' }
        })
      },
      // Toyota Corolla - Reservation 2
      {
        id: uuidv4(),
        carId: cars[4].id,
        startDate: getDateString(14),
        endDate: getDateString(21),
        departureAgency: 'Aéroport Oran',
        returnAgency: 'Agence Tlemcen',
        customerName: 'Zineb Fassi',
        customerEmail: 'zineb.fassi@email.com',
        customerPhone: '0669900111',
        totalPrice: 2450, // 7 days * 350
        notes: 'Vacances en famille',
        documents: JSON.stringify({
          cin: { name: 'cin_zineb.jpg', type: 'image/jpeg' },
          permis: { name: 'permis_zineb.jpg', type: 'image/jpeg' }
        })
      }
    ];

    // Insert reservations
    const reservations = await Reservation.bulkCreate(reservationsData);
    console.log('📅 Created 10 sample reservations (2 per car):');
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
