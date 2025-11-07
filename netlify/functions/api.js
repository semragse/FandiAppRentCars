const express = require('express');
const serverless = require('serverless-http');

// Import du serveur Express existant
const app = express();

// Configuration CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Import des routes du backend
const { sequelize, Car, Reservation, Setting, PaymentSettings } = require('../../backend/models');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: process.env.DATABASE_URL ? 'Neon PostgreSQL' : 'SQLite' });
});

// Routes Cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ error: error.message });
  }
});

// Routes Reservations
app.get('/api/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [{ model: Car }],
      order: [['startDate', 'DESC']]
    });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    const fullReservation = await Reservation.findByPk(reservation.id, {
      include: [{ model: Car }]
    });
    res.status(201).json(fullReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/reservations/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    await reservation.update(req.body);
    const updatedReservation = await Reservation.findByPk(req.params.id, {
      include: [{ model: Car }]
    });
    res.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reservations/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    await reservation.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Routes Settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await Setting.upsert({ key, value });
    }
    const settings = await Setting.findAll();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json(settingsObj);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Routes Payment Settings
app.get('/api/payment-settings', async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/payment-settings', async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create(req.body);
    } else {
      await settings.update(req.body);
    }
    res.json(settings);
  } catch (error) {
    console.error('Error updating payment settings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Initialiser la base de données
sequelize.sync().then(() => {
  console.log('✅ Database synced for Netlify Functions');
}).catch(err => {
  console.error('❌ Database sync error:', err);
});

// Export pour Netlify Functions
module.exports.handler = serverless(app);
