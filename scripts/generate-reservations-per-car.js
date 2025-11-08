const { sequelize, Car, Reservation } = require('./models');
const { v4: uuidv4 } = require('uuid');

// Lists of random data
const firstNames = ['Mohamed', 'Fatima', 'Ahmed', 'Khadija', 'Youssef', 'Aicha', 'Omar', 'Samira', 'Karim', 'Nadia', 
                    'Hassan', 'Leila', 'Ali', 'Zohra', 'Rachid', 'Malika', 'Mehdi', 'Amina', 'Said', 'Salma'];
const lastNames = ['Bennani', 'Alaoui', 'El Amrani', 'Tazi', 'Idrissi', 'Benjelloun', 'Fassi', 'Chraibi', 
                   'Berrada', 'Cherkaoui', 'Lahlou', 'Ouazzani', 'Kettani', 'Sedrati', 'Filali', 'Mekouar'];
const agencies = ['Aéroport Tlemcen', 'Aéroport Oran', 'Agence Tlemcen'];
const notes = [
  'Voyage d\'affaires',
  'Vacances en famille',
  'Client régulier',
  'Déplacement professionnel',
  'Week-end prolongé',
  'Visite touristique',
  'Retour à l\'aéroport requis',
  'Siège bébé nécessaire',
  'GPS demandé',
  'Réduction appliquée - client fidèle',
  'Première réservation',
  'Conducteur additionnel',
  'Assurance tous risques',
  'Voyage de noces',
  'Congrès médical'
];

// Helper function to get random element from array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random integer between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get date string
function getDateString(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

// Generate random phone number
function generatePhone() {
  const prefixes = ['0661', '0662', '0663', '0664', '0665', '0666', '0667', '0668', '0669'];
  const prefix = getRandomElement(prefixes);
  const suffix = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return prefix + suffix;
}

async function generateReservationsPerCar() {
  try {
    console.log('🎲 Generating 2 reservations per car...\n');

    // Get all cars
    const cars = await Car.findAll();
    if (cars.length === 0) {
      console.error('❌ No cars found in database. Please run seed-database.js first.');
      process.exit(1);
    }

    console.log(`📊 Found ${cars.length} cars in database`);
    console.log(`📅 Will create ${cars.length * 2} reservations (2 per car)\n`);

    const reservationsData = [];

    // Generate 2 reservations for each car
    for (const car of cars) {
      for (let i = 0; i < 2; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        
        // Random start date between -30 and +60 days from now
        const startDayOffset = getRandomInt(-30, 60);
        // Duration between 1 and 14 days
        const duration = getRandomInt(1, 14);
        const endDayOffset = startDayOffset + duration;

        const departureAgency = getRandomElement(agencies);
        const returnAgency = getRandomElement(agencies);

        const totalPrice = car.price * duration;

        reservationsData.push({
          id: uuidv4(),
          carId: car.id,
          startDate: getDateString(startDayOffset),
          endDate: getDateString(endDayOffset),
          departureAgency: departureAgency,
          returnAgency: returnAgency,
          customerName: `${firstName} ${lastName}`,
          customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
          customerPhone: generatePhone(),
          totalPrice: totalPrice,
          notes: getRandomElement(notes),
          documents: JSON.stringify({
            cin: { name: `cin_${firstName.toLowerCase()}.jpg`, type: 'image/jpeg' },
            permis: { name: `permis_${firstName.toLowerCase()}.jpg`, type: 'image/jpeg' }
          })
        });
      }
    }

    // Insert reservations
    const reservations = await Reservation.bulkCreate(reservationsData);
    
    console.log(`✅ Created ${reservations.length} reservations:\n`);
    
    // Group by car for display
    const carMap = new Map();
    cars.forEach(car => carMap.set(car.id, car));
    
    const reservationsByCar = new Map();
    reservations.forEach(res => {
      if (!reservationsByCar.has(res.carId)) {
        reservationsByCar.set(res.carId, []);
      }
      reservationsByCar.get(res.carId).push(res);
    });

    let index = 1;
    reservationsByCar.forEach((carReservations, carId) => {
      const car = carMap.get(carId);
      console.log(`🚗 ${car.name} @ ${car.locationAgency}:`);
      carReservations.forEach(reservation => {
        console.log(`  ${index}. ${reservation.customerName}`);
        console.log(`     Dates: ${reservation.startDate} → ${reservation.endDate}`);
        console.log(`     ${reservation.departureAgency} → ${reservation.returnAgency}`);
        console.log(`     Prix: ${reservation.totalPrice} DH`);
        index++;
      });
      console.log('');
    });

    // Display summary
    const totalReservations = await Reservation.count();
    console.log('📊 Database Summary:');
    console.log(`  - Total Cars: ${cars.length}`);
    console.log(`  - Total Reservations: ${totalReservations}`);
    console.log('');

    console.log('✅ Reservations generated successfully!');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error generating reservations:', error.message);
    console.error(error);
    process.exit(1);
  }
}

generateReservationsPerCar();
