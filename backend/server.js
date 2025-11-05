const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const { sequelize, Car, Reservation } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all cars
app.get('/cars', async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cars' });
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
    const { carId, startDate, endDate, customerName, customerEmail, customerPhone, totalPrice } = req.body;
    if (!carId || !startDate || !endDate || !customerName || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
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
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      totalPrice: finalPrice,
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
    { id: 'car1', name: 'Clio 5', price: 35, image: 'images/clio5.jpg' },
    { id: 'car2', name: 'Audi A4', price: 85, image: 'images/audia4.jpg' },
    { id: 'car3', name: 'Mercedes CLA 220', price: 120, image: 'images/Mercedes CLA 220.jpg' },
    { id: 'car4', name: 'Dacia Logan', price: 45, image: 'images/Dacia Logan.jpg' },
    { id: 'car5', name: 'Peugeot 308', price: 65, image: 'images/Peugeot 308.jpg' },
  ];
  await Car.bulkCreate(cars);

  // Sample reservations (future dates)
  const reservations = [
    { id: uuidv4(), carId: 'car1', startDate: '2025-11-10', endDate: '2025-11-12', customerName: 'Test User', customerEmail: 'test1@example.com', customerPhone: '+212600000001', totalPrice: 35 * 2 },
    { id: uuidv4(), carId: 'car2', startDate: '2025-11-13', endDate: '2025-11-16', customerName: 'Test User 2', customerEmail: 'test2@example.com', customerPhone: '+212600000002', totalPrice: 85 * 3 },
  ];
  await Reservation.bulkCreate(reservations);
}

(async () => {
  try {
    await sequelize.sync();
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
