const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const { sequelize, Car, Reservation } = require('./models');

// Centralized agencies list (single source of truth)
const AGENCIES = [
  'Aéroport Tlemcen',
  'Aéroport Oran',
  'Agence Tlemcen'
];

// Helper validation
function isValidAgency(value) {
  return AGENCIES.includes(value);
}

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all cars
// List agencies
app.get('/agencies', (req, res) => {
  res.json(AGENCIES);
});

// Get all cars (optional filter by location agency)
app.get('/cars', async (req, res) => {
  try {
    const { agency } = req.query;
    const where = agency && isValidAgency(agency) ? { locationAgency: agency } : {};
    const cars = await Car.findAll({ where });
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// Add a new car
app.post('/cars', async (req, res) => {
  try {
    const { name, price, image, locationAgency } = req.body;
    if (!name || !price || !image || !locationAgency) {
      return res.status(400).json({ error: 'Missing required fields (name, price, image, locationAgency)' });
    }
    if (!isValidAgency(locationAgency)) {
      return res.status(400).json({ error: 'Invalid locationAgency' });
    }
    const carId = 'car' + Date.now();
    const newCar = await Car.create({ id: carId, name, price, image, locationAgency });
    res.status(201).json(newCar);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add car' });
  }
});

// Update a car
app.put('/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, locationAgency } = req.body;
    
    console.log('📝 PUT /cars/' + id);
    console.log('📦 Données reçues:', { name, price, hasImage: !!image });
    
    const car = await Car.findByPk(id);
    if (!car) {
      console.log('❌ Voiture non trouvée:', id);
      return res.status(404).json({ error: 'Car not found' });
    }

    console.log('📌 Voiture avant modification:', { name: car.name, price: car.price });

    // Update fields (only update if provided)
    if (name !== undefined) car.name = name;
    if (price !== undefined) car.price = price;
  if (image !== undefined) car.image = image;
  if (locationAgency !== undefined) {
    if (!isValidAgency(locationAgency)) {
      return res.status(400).json({ error: 'Invalid locationAgency' });
    }
    car.locationAgency = locationAgency;
  }

    await car.save();
    
    console.log('✅ Voiture après modification:', { name: car.name, price: car.price });
    
    res.json(car);
  } catch (err) {
    console.error('❌ Erreur:', err);
    res.status(500).json({ error: 'Failed to update car' });
  }
});

// Delete a car
app.delete('/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete all reservations for this car first
    await Reservation.destroy({ where: { carId: id } });
    
    // Delete the car
    await Car.destroy({ where: { id } });
    
    res.json({ message: 'Car and its reservations deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

// Get reservations (optional filter by carId)
app.get('/reservations', async (req, res) => {
  try {
    const { carId } = req.query;
    const where = carId ? { carId } : {};
    const reservations = await Reservation.findAll({ where });
    res.json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Add a reservation with overlap validation
app.post('/reservations', async (req, res) => {
  try {
    const { carId, startDate, endDate, customerName, customerEmail, customerPhone, totalPrice, notes, documents, departureAgency, returnAgency } = req.body;
    if (!carId || !startDate || !endDate || !customerName || !customerEmail || !departureAgency || !returnAgency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!isValidAgency(departureAgency) || !isValidAgency(returnAgency)) {
      return res.status(400).json({ error: 'Invalid departureAgency or returnAgency' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    // Check car exists
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Overlap validation: (start <= existing.end) AND (end >= existing.start)
    const overlaps = await Reservation.findAll({
      where: {
        carId,
      }
    });
    const conflict = overlaps.some(r => {
      const rStart = new Date(r.startDate);
      const rEnd = new Date(r.endDate);
      return start <= rEnd && end >= rStart;
    });
    if (conflict) {
      return res.status(409).json({ error: 'Reservation conflict' });
    }

    // Compute price if not provided
    let finalPrice = totalPrice;
    if (!finalPrice) {
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      finalPrice = car.price * days;
    }

    const reservation = await Reservation.create({
      id: uuidv4(),
      carId,
      startDate,
      endDate,
      departureAgency,
      returnAgency,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      totalPrice: finalPrice,
      notes: notes || '',
      documents: documents || null,
    });
    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Delete a reservation
app.delete('/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    await reservation.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

// Update a reservation
app.put('/reservations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { carId, startDate, endDate, customerName, customerEmail, customerPhone, totalPrice, notes, documents, departureAgency, returnAgency } = req.body;
    
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update fields
    if (carId) reservation.carId = carId;
    if (startDate) reservation.startDate = startDate;
    if (endDate) reservation.endDate = endDate;
    if (customerName) reservation.customerName = customerName;
    if (customerEmail) reservation.customerEmail = customerEmail;
    if (customerPhone !== undefined) reservation.customerPhone = customerPhone;
    if (totalPrice !== undefined) reservation.totalPrice = totalPrice;
    if (notes !== undefined) reservation.notes = notes;
  if (documents !== undefined) reservation.documents = documents;
  if (departureAgency !== undefined) {
    if (!isValidAgency(departureAgency)) {
      return res.status(400).json({ error: 'Invalid departureAgency' });
    }
    reservation.departureAgency = departureAgency;
  }
  if (returnAgency !== undefined) {
    if (!isValidAgency(returnAgency)) {
      return res.status(400).json({ error: 'Invalid returnAgency' });
    }
    reservation.returnAgency = returnAgency;
  }

    await reservation.save();
    res.json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Seed endpoint (optional, for development)
app.post('/seed', async (req, res) => {
  try {
    const existingCars = await Car.count();
    if (existingCars === 0) {
      await seedData();
      return res.json({ seeded: true });
    }
    res.json({ seeded: false, message: 'Cars already exist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Seed failed' });
  }
});

async function seedData() {
  const cars = [
    { id: 'car1', name: 'Clio 5', price: 35, image: 'images/clio5.jpg', locationAgency: AGENCIES[0] },
    { id: 'car2', name: 'Audi A4', price: 85, image: 'images/audia4.jpg', locationAgency: AGENCIES[1] },
    { id: 'car3', name: 'Mercedes CLA 220', price: 120, image: 'images/Mercedes CLA 220.jpg', locationAgency: AGENCIES[2] },
    { id: 'car4', name: 'Dacia Logan', price: 45, image: 'images/Dacia Logan.jpg', locationAgency: AGENCIES[0] },
    { id: 'car5', name: 'Peugeot 308', price: 65, image: 'images/Peugeot 308.jpg', locationAgency: AGENCIES[1] },
  ];
  await Car.bulkCreate(cars);

  const reservations = [
    { id: uuidv4(), carId: 'car1', startDate: '2025-11-10', endDate: '2025-11-12', departureAgency: AGENCIES[0], returnAgency: AGENCIES[0], customerName: 'Ahmed Alami', customerEmail: 'ahmed.alami@example.com', customerPhone: '+212 6 12 34 56 78', totalPrice: 35 * 2 },
    { id: uuidv4(), carId: 'car1', startDate: '2025-11-20', endDate: '2025-11-22', departureAgency: AGENCIES[0], returnAgency: AGENCIES[2], customerName: 'Yasmine Benjelloun', customerEmail: 'yasmine.b@example.com', customerPhone: '+212 6 23 45 67 89', totalPrice: 35 * 2 },
    { id: uuidv4(), carId: 'car2', startDate: '2025-11-13', endDate: '2025-11-16', departureAgency: AGENCIES[1], returnAgency: AGENCIES[1], customerName: 'Karim Tazi', customerEmail: 'karim.tazi@example.com', customerPhone: '+212 6 34 56 78 90', totalPrice: 85 * 3 },
    { id: uuidv4(), carId: 'car2', startDate: '2025-12-01', endDate: '2025-12-03', departureAgency: AGENCIES[1], returnAgency: AGENCIES[0], customerName: 'Leila Fassi', customerEmail: 'leila.fassi@example.com', customerPhone: '+212 6 45 67 89 01', totalPrice: 85 * 2 },
    { id: uuidv4(), carId: 'car3', startDate: '2025-11-15', endDate: '2025-11-18', departureAgency: AGENCIES[2], returnAgency: AGENCIES[2], customerName: 'Omar Bennani', customerEmail: 'omar.bennani@example.com', customerPhone: '+212 6 56 78 90 12', totalPrice: 120 * 3 },
    { id: uuidv4(), carId: 'car3', startDate: '2025-11-25', endDate: '2025-11-28', departureAgency: AGENCIES[2], returnAgency: AGENCIES[1], customerName: 'Salma Chraibi', customerEmail: 'salma.chraibi@example.com', customerPhone: '+212 6 67 89 01 23', totalPrice: 120 * 3 },
    { id: uuidv4(), carId: 'car4', startDate: '2025-11-08', endDate: '2025-11-10', departureAgency: AGENCIES[0], returnAgency: AGENCIES[0], customerName: 'Hassan Idrissi', customerEmail: 'hassan.idrissi@example.com', customerPhone: '+212 6 78 90 12 34', totalPrice: 45 * 2 },
    { id: uuidv4(), carId: 'car4', startDate: '2025-11-18', endDate: '2025-11-20', departureAgency: AGENCIES[0], returnAgency: AGENCIES[2], customerName: 'Nadia Lahlou', customerEmail: 'nadia.lahlou@example.com', customerPhone: '+212 6 89 01 23 45', totalPrice: 45 * 2 },
    { id: uuidv4(), carId: 'car5', startDate: '2025-11-12', endDate: '2025-11-15', departureAgency: AGENCIES[1], returnAgency: AGENCIES[1], customerName: 'Youssef Kadiri', customerEmail: 'youssef.kadiri@example.com', customerPhone: '+212 6 90 12 34 56', totalPrice: 65 * 3 },
    { id: uuidv4(), carId: 'car5', startDate: '2025-11-22', endDate: '2025-11-25', departureAgency: AGENCIES[1], returnAgency: AGENCIES[0], customerName: 'Fatima Zahra', customerEmail: 'fatima.zahra@example.com', customerPhone: '+212 6 01 23 45 67', totalPrice: 65 * 3 },
  ];
  await Reservation.bulkCreate(reservations);
  console.log('✅ Seeded cars & reservations with unified agencies');
}

// Periodic task: reconcile car locations after reservations end (move car to return agency)
async function reconcileCarLocations() {
  const now = new Date();
  const endedReservations = await Reservation.findAll({ where: { movementApplied: false } });
  for (const r of endedReservations) {
    const end = new Date(r.endDate);
    if (end < now) {
      const car = await Car.findByPk(r.carId);
      if (car && car.locationAgency !== r.returnAgency && isValidAgency(r.returnAgency)) {
        car.locationAgency = r.returnAgency;
        await car.save();
        r.movementApplied = true;
        await r.save();
        console.log(`🔄 Car ${car.id} moved to ${car.locationAgency} after reservation ${r.id}`);
      } else if (car) {
        // Mark movement processed even if no change needed
        r.movementApplied = true;
        await r.save();
      }
    }
  }
}

(async () => {
  try {
  await sequelize.sync({ alter: true });
    // Auto-seed if empty
    const carCount = await Car.count();
    if (carCount === 0) {
      await seedData();
      console.log('Seeded initial data');
    }
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
