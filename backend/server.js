const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const stripe = require('./config/stripe');
const { sequelize, Car, Reservation, Setting, PaymentSettings } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

// Trust proxy for Railway/Heroku deployment
app.set('trust proxy', 1);

// Enable compression for all responses
app.use(compression());

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add cache control headers to prevent caching issues
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// Serve static website files. Primary public directory plus legacy root fallback.
const STATIC_ROOT = path.join(__dirname, '..'); // legacy root (old html files)
const PUBLIC_ROOT = path.join(__dirname, '..', 'public');

// Mount public first (preferred), then legacy root and pages/
if (fs.existsSync(PUBLIC_ROOT)) {
  app.use(express.static(PUBLIC_ROOT));
  console.log('🗂️ Public directory mounted:', PUBLIC_ROOT);
} else {
  console.log('⚠️ Public directory not found, skipping:', PUBLIC_ROOT);
}
app.use(express.static(STATIC_ROOT));
app.use(express.static(path.join(STATIC_ROOT, 'pages')));
console.log('🗂️ Legacy static root mounted:', STATIC_ROOT);

// Root route now serves the main website (index.html). If you still want the
// plain text status, you can move this to /status instead.
app.get('/', (req, res) => {
  const publicIndex = path.join(PUBLIC_ROOT, 'index.html');
  if (fs.existsSync(publicIndex)) return res.sendFile(publicIndex);
  const legacyIndex = path.join(STATIC_ROOT, 'index.html');
  if (fs.existsSync(legacyIndex)) return res.sendFile(legacyIndex);
  return res.status(404).send('index.html not found in public/ or root');
});

// Convenience redirect /admin -> /admin.html
app.get('/admin', (req, res) => res.redirect('/admin.html'));

// Explicit admin.html route (some hosting environments may skip dynamic fallback)
app.get('/admin.html', (req, res) => {
  const publicAdmin = path.join(PUBLIC_ROOT, 'admin.html');
  if (fs.existsSync(publicAdmin)) return res.sendFile(publicAdmin);
  const legacyAdmin = path.join(STATIC_ROOT, 'admin.html');
  if (fs.existsSync(legacyAdmin)) return res.sendFile(legacyAdmin);
  return res.status(404).send('admin.html not found in public/ or root');
});

// Dynamic .html file fallback (e.g. /admin.html, /payment.html, etc.)
app.get('/:page.html', (req, res, next) => {
  const fileName = req.params.page + '.html';
  const publicPath = path.join(PUBLIC_ROOT, fileName);
  if (fs.existsSync(publicPath)) return res.sendFile(publicPath);
  const legacyPath = path.join(STATIC_ROOT, fileName);
  if (fs.existsSync(legacyPath)) return res.sendFile(legacyPath);
  return next();
});

// Optional status endpoint for uptime / monitoring tools
app.get('/status', (req, res) => {
  const dialect = sequelize.getDialect();
  res.json({ ok: true, message: 'API running', dialect });
});

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

// Add a new car
app.post('/cars', async (req, res) => {
  try {
    const { name, price, image, locationAgency, seats, fuelType, transmission, airConditioning, doors } = req.body;
    if (!name || !price || !image || !locationAgency) {
      return res.status(400).json({ error: 'Missing required fields (name, price, image, locationAgency)' });
    }
    const carId = 'car' + Date.now();
    const newCar = await Car.create({ 
      id: carId, 
      name, 
      price, 
      image, 
      locationAgency,
      seats: seats || 5,
      fuelType: fuelType || 'Essence SP',
      transmission: transmission || 'Automatique',
      airConditioning: airConditioning !== false,
      doors: doors || 5
    });
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
    const { name, price, image, locationAgency, seats, fuelType, transmission, airConditioning, doors } = req.body;
    
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
    if (locationAgency !== undefined) car.locationAgency = locationAgency;
    if (seats !== undefined) car.seats = seats;
    if (fuelType !== undefined) car.fuelType = fuelType;
    if (transmission !== undefined) car.transmission = transmission;
    if (airConditioning !== undefined) car.airConditioning = airConditioning;
    if (doors !== undefined) car.doors = doors;

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
    const { carId, startDate, endDate, customerName, customerEmail, customerPhone, totalPrice, notes, documents, departureAgency, returnAgency, status } = req.body;
    if (!carId || !startDate || !endDate || !customerName || !customerEmail || !departureAgency || !returnAgency) {
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
    // Seulement vérifier les réservations acceptées (ignorer pending et refused)
    const overlaps = await Reservation.findAll({
      where: {
        carId,
        status: 'accepted' // Vérifier uniquement les réservations confirmées
      }
    });
    
    console.log('🔍 Checking overlap for car:', carId);
    console.log('📅 New reservation:', { start: start.toISOString(), end: end.toISOString() });
    console.log('📋 Existing accepted reservations:', overlaps.length);
    
    const conflict = overlaps.some(r => {
      const rStart = new Date(r.startDate);
      const rEnd = new Date(r.endDate);
      const overlaps = start <= rEnd && end >= rStart;
      console.log(`  - Existing: ${rStart.toISOString().split('T')[0]} to ${rEnd.toISOString().split('T')[0]} | Overlap: ${overlaps}`);
      return overlaps;
    });
    
    if (conflict) {
      console.log('❌ Conflict detected!');
      return res.status(409).json({ error: 'Reservation conflict' });
    }
    console.log('✅ No conflict - reservation can proceed');

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
      status: status || 'pending', // Utiliser le status fourni ou 'pending' par défaut
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
    const { carId, startDate, endDate, customerName, customerEmail, customerPhone, totalPrice, notes, documents, departureAgency, returnAgency, status } = req.body;
    
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
    if (departureAgency !== undefined) reservation.departureAgency = departureAgency;
    if (returnAgency !== undefined) reservation.returnAgency = returnAgency;
    if (status !== undefined) reservation.status = status;

    await reservation.save();
    res.json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// ============= SETTINGS ENDPOINTS =============

// Get all settings
app.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      let value = setting.value;
      // Parse JSON if type is json
      if (setting.type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          console.error('Error parsing JSON setting:', setting.key, e);
        }
      } else if (setting.type === 'number') {
        value = parseFloat(value);
      } else if (setting.type === 'boolean') {
        value = value === 'true';
      }
      settingsObj[setting.key] = value;
    });
    res.json(settingsObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get a single setting by key
app.get('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findByPk(key);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    let value = setting.value;
    if (setting.type === 'json') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error('Error parsing JSON setting:', setting.key, e);
      }
    } else if (setting.type === 'number') {
      value = parseFloat(value);
    } else if (setting.type === 'boolean') {
      value = value === 'true';
    }
    
    res.json({ key: setting.key, value, type: setting.type, description: setting.description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// Update or create a setting
app.put('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value, type, description } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }
    
    // Convert value to string for storage
    let valueStr = value;
    if (type === 'json') {
      valueStr = JSON.stringify(value);
    } else if (typeof value !== 'string') {
      valueStr = String(value);
    }
    
    // Find or create setting
    const [setting, created] = await Setting.findOrCreate({
      where: { key },
      defaults: {
        value: valueStr,
        type: type || 'string',
        description: description || null
      }
    });
    
    if (!created) {
      // Update existing setting
      setting.value = valueStr;
      if (type) setting.type = type;
      if (description !== undefined) setting.description = description;
      await setting.save();
    }
    
    res.json({ 
      success: true, 
      setting: {
        key: setting.key,
        value: value,
        type: setting.type,
        description: setting.description
      },
      created
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Update contact information (batch update)
app.post('/settings/contact', async (req, res) => {
  try {
    const { phone, email, address } = req.body;
    
    // Validation
    if (!phone || !email || !address) {
      return res.status(400).json({ error: 'All fields are required (phone, email, address)' });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 8) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    // Update or create settings
    await Setting.findOrCreate({
      where: { key: 'contact_phone' },
      defaults: { value: phone, type: 'string', description: 'Contact phone number' }
    }).then(([setting]) => {
      setting.value = phone;
      return setting.save();
    });
    
    await Setting.findOrCreate({
      where: { key: 'contact_email' },
      defaults: { value: email, type: 'string', description: 'Contact email address' }
    }).then(([setting]) => {
      setting.value = email;
      return setting.save();
    });
    
    await Setting.findOrCreate({
      where: { key: 'contact_address' },
      defaults: { value: address, type: 'string', description: 'Physical address' }
    }).then(([setting]) => {
      setting.value = address;
      return setting.save();
    });
    
    res.json({ 
      success: true, 
      message: 'Contact information updated successfully',
      data: { phone, email, address }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update contact information' });
  }
});

// ============= END SETTINGS ENDPOINTS =============

// ============= PAYMENT ENDPOINTS =============

// Create a payment intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur' } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Stripe expects amount in smallest currency unit (cents)
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('❌ Error creating payment intent:', err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// ============= END PAYMENT ENDPOINTS =============

// ============= PAYMENT SETTINGS ENDPOINTS =============

// Get payment settings
app.get('/payment-settings', async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = await PaymentSettings.create({
        bankName: 'Banque Exemple',
        accountHolderName: 'FANDIAUTO',
        iban: 'DZ00 0000 0000 0000 0000 0000',
        bicSwift: 'XXXXDZXX',
        stripePublicKey: 'pk_test_51QzoteKoPCrvfoFnpEmPEDWk4CNDnH4wyE8gD0wkuy9tkDqViHylV5GaKbVaveaQedHmxfxw6MmVAXiGiDoNZ8u400jaiF65qv',
        stripeSecretKey: '',
        paypalBusinessEmail: '',
        paypalInstructions: 'Envoyez votre paiement à notre compte PayPal et incluez votre numéro de réservation dans la note.',
        bankTransferEnabled: true,
        stripeEnabled: true,
        paypalEnabled: false
      });
    }
    
    res.json(settings);
  } catch (err) {
    console.error('❌ Error fetching payment settings:', err);
    res.status(500).json({ error: 'Failed to fetch payment settings' });
  }
});

// Update payment settings
app.put('/payment-settings', async (req, res) => {
  try {
    const {
      bankName,
      accountHolderName,
      iban,
      bicSwift,
      stripePublicKey,
      stripeSecretKey,
      paypalBusinessEmail,
      paypalInstructions,
      bankTransferEnabled,
      stripeEnabled,
      paypalEnabled
    } = req.body;

    let settings = await PaymentSettings.findOne();
    
    if (!settings) {
      // Create new settings
      settings = await PaymentSettings.create(req.body);
    } else {
      // Update existing settings
      await settings.update({
        bankName,
        accountHolderName,
        iban,
        bicSwift,
        stripePublicKey,
        stripeSecretKey,
        paypalBusinessEmail,
        paypalInstructions,
        bankTransferEnabled,
        stripeEnabled,
        paypalEnabled
      });
    }
    
    console.log('✅ Payment settings updated successfully');
    res.json(settings);
  } catch (err) {
    console.error('❌ Error updating payment settings:', err);
    res.status(500).json({ error: 'Failed to update payment settings', details: err.message });
  }
});

// ============= END PAYMENT SETTINGS ENDPOINTS =============

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
    { id: 'car1', name: 'Clio 5', price: 35, image: 'images/clio5.jpg', locationAgency: 'Aéroport Tlemcen - Messali El Hadj' },
    { id: 'car2', name: 'Audi A4', price: 85, image: 'images/audia4.jpg', locationAgency: 'Aéroport d\'Oran - Ahmed Ben Bella' },
    { id: 'car3', name: 'Mercedes CLA 220', price: 120, image: 'images/Mercedes CLA 220.jpg', locationAgency: 'Agence ANISTOUR Oran' },
    { id: 'car4', name: 'Dacia Logan', price: 45, image: 'images/Dacia Logan.jpg', locationAgency: 'Agence ANISTOUR Tlemcen' },
    { id: 'car5', name: 'Peugeot 308', price: 65, image: 'images/Peugeot 308.jpg', locationAgency: 'Aéroport de Chlef' },
  ];
  await Car.bulkCreate(cars);

  // Sample reservations (future dates) - toutes les voitures avec status 'accepted'
  const reservations = [
    // Clio 5
    { id: uuidv4(), carId: 'car1', startDate: '2025-11-10', endDate: '2025-11-12', departureAgency: 'Aéroport Tlemcen', returnAgency: 'Aéroport Tlemcen', customerName: 'Ahmed Alami', customerEmail: 'ahmed.alami@example.com', customerPhone: '+212 6 12 34 56 78', totalPrice: 35 * 2, status: 'accepted' },
    { id: uuidv4(), carId: 'car1', startDate: '2025-11-20', endDate: '2025-11-22', departureAgency: 'Aéroport Tlemcen', returnAgency: 'Aéroport Tlemcen', customerName: 'Yasmine Benjelloun', customerEmail: 'yasmine.b@example.com', customerPhone: '+212 6 23 45 67 89', totalPrice: 35 * 2, status: 'accepted' },
    
    // Audi A4
    { id: uuidv4(), carId: 'car2', startDate: '2025-11-13', endDate: '2025-11-16', departureAgency: 'Aéroport d\'Oran', returnAgency: 'Aéroport d\'Oran', customerName: 'Karim Tazi', customerEmail: 'karim.tazi@example.com', customerPhone: '+212 6 34 56 78 90', totalPrice: 85 * 3, status: 'accepted' },
    { id: uuidv4(), carId: 'car2', startDate: '2025-12-01', endDate: '2025-12-03', departureAgency: 'Aéroport d\'Oran', returnAgency: 'Aéroport d\'Oran', customerName: 'Leila Fassi', customerEmail: 'leila.fassi@example.com', customerPhone: '+212 6 45 67 89 01', totalPrice: 85 * 2, status: 'accepted' },
    
    // Mercedes CLA 220
    { id: uuidv4(), carId: 'car3', startDate: '2025-11-15', endDate: '2025-11-18', departureAgency: 'Agence ANISTOUR Oran', returnAgency: 'Agence ANISTOUR Oran', customerName: 'Omar Bennani', customerEmail: 'omar.bennani@example.com', customerPhone: '+212 6 56 78 90 12', totalPrice: 120 * 3, status: 'accepted' },
    { id: uuidv4(), carId: 'car3', startDate: '2025-11-25', endDate: '2025-11-28', departureAgency: 'Agence ANISTOUR Oran', returnAgency: 'Agence ANISTOUR Oran', customerName: 'Salma Chraibi', customerEmail: 'salma.chraibi@example.com', customerPhone: '+212 6 67 89 01 23', totalPrice: 120 * 3, status: 'accepted' },
    
    // Dacia Logan
    { id: uuidv4(), carId: 'car4', startDate: '2025-11-08', endDate: '2025-11-10', departureAgency: 'Agence ANISTOUR Tlemcen', returnAgency: 'Agence ANISTOUR Tlemcen', customerName: 'Hassan Idrissi', customerEmail: 'hassan.idrissi@example.com', customerPhone: '+212 6 78 90 12 34', totalPrice: 45 * 2, status: 'accepted' },
    { id: uuidv4(), carId: 'car4', startDate: '2025-11-18', endDate: '2025-11-20', departureAgency: 'Agence ANISTOUR Tlemcen', returnAgency: 'Agence ANISTOUR Tlemcen', customerName: 'Nadia Lahlou', customerEmail: 'nadia.lahlou@example.com', customerPhone: '+212 6 89 01 23 45', totalPrice: 45 * 2, status: 'accepted' },
    
    // Peugeot 308
    { id: uuidv4(), carId: 'car5', startDate: '2025-11-12', endDate: '2025-11-15', departureAgency: 'Aéroport de Chlef', returnAgency: 'Aéroport de Chlef', customerName: 'Youssef Kadiri', customerEmail: 'youssef.kadiri@example.com', customerPhone: '+212 6 90 12 34 56', totalPrice: 65 * 3, status: 'accepted' },
    { id: uuidv4(), carId: 'car5', startDate: '2025-11-22', endDate: '2025-11-25', departureAgency: 'Aéroport de Chlef', returnAgency: 'Aéroport de Chlef', customerName: 'Fatima Zahra', customerEmail: 'fatima.zahra@example.com', customerPhone: '+212 6 01 23 45 67', totalPrice: 65 * 3, status: 'accepted' },
  ];
  await Reservation.bulkCreate(reservations);
  console.log('✅ 10 réservations de test créées pour les 5 voitures (status: accepted)');
  
  // Create default settings
  const defaultSettings = [
    { key: 'contact_phone', value: '+213 771 39 14 80', type: 'string', description: 'Contact phone number' },
    { key: 'contact_email', value: 'contact@fandiauto.com', type: 'string', description: 'Contact email address' },
    { key: 'contact_address', value: 'Tlemcen, Algérie', type: 'string', description: 'Physical address' },
    { key: 'company_name', value: 'FANDIAUTO', type: 'string', description: 'Company name' },
    { key: 'whatsapp_number', value: '213771391480', type: 'string', description: 'WhatsApp contact number' }
  ];
  
  for (const setting of defaultSettings) {
    await Setting.findOrCreate({
      where: { key: setting.key },
      defaults: setting
    });
  }
  console.log('✅ Paramètres par défaut créés');
}

// ============= 404 HANDLER (MUST BE LAST) =============
// Catch-all 404 handler - must be after all other routes
app.use((req, res) => {
  // If request is for API endpoint, return JSON error
  if (req.path.startsWith('/api') || req.path.match(/^\/(cars|reservations|settings|payment)/)) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // For all other paths, try to serve a 404 page or redirect to home
  const notFoundPath = path.join(PUBLIC_ROOT, '404.html');
  if (fs.existsSync(notFoundPath)) {
    return res.status(404).sendFile(notFoundPath);
  }
  
  // Fallback: redirect to home
  res.redirect('/');
});

// ============= ERROR HANDLER =============
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

(async () => {
  try {
    await sequelize.authenticate();
    const summary = sequelize.connectionSummary ? sequelize.connectionSummary() : { dialect: sequelize.getDialect() };
    console.log('🔌 Database connection established:', summary);

    await sequelize.sync();
    // Auto-seed if empty (only in non-production or when explicitly requested)
    const shouldAutoSeed = process.env.AUTO_SEED === 'true' || process.env.NODE_ENV !== 'production';
    if (shouldAutoSeed) {
      const carCount = await Car.count();
      if (carCount === 0) {
        await seedData();
        console.log('Seeded initial data');
      }
    }
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
