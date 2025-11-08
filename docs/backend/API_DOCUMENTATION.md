# 🚀 Backend API Documentation

## Overview
The FandiApp backend is built with:
- **Framework**: Express.js (Node.js)
- **Database**: SQLite 3 (file: `fandicars.db`)
- **ORM**: Sequelize v6.37.1
- **Port**: 3001 (default)

## 📚 Database Schema

### Cars Table
```sql
CREATE TABLE cars (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  image VARCHAR(255),
  location_agency VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### Reservations Table
```sql
CREATE TABLE reservations (
  id VARCHAR(255) PRIMARY KEY,
  carId VARCHAR(255) NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  departure_agency VARCHAR(255) NOT NULL,
  return_agency VARCHAR(255) NOT NULL,
  customerName VARCHAR(255) NOT NULL,
  customerEmail VARCHAR(255) NOT NULL,
  customerPhone VARCHAR(255),
  totalPrice INTEGER NOT NULL,
  notes TEXT,
  documents TEXT,
  createdAt DATETIME,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (carId) REFERENCES cars(id)
);
```

## 🔌 API Endpoints

### Health Check

#### `GET /health`
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-07T14:49:44.945Z"
}
```

---

### Cars Endpoints

#### `GET /cars`
Get all cars from the database.

**Response:**
```json
[
  {
    "id": "5ef435c0-40a1-4803-8124-e7d49b63b830",
    "name": "Renault Clio 5",
    "price": 250,
    "image": "images/clio5.jpg",
    "locationAgency": "Aéroport",
    "createdAt": "2025-11-07T14:00:00.000Z",
    "updatedAt": "2025-11-07T14:00:00.000Z"
  }
]
```

---

#### `POST /cars`
Add a new car.

**Request Body:**
```json
{
  "name": "Renault Clio 5",
  "price": 250,
  "image": "images/clio5.jpg",
  "locationAgency": "Aéroport"
}
```

**Required Fields:**
- `name` (string): Car name
- `price` (number): Daily rental price
- `image` (string): Image path or base64 data
- `locationAgency` (string): Current location

**Response:** (201 Created)
```json
{
  "id": "car1762526985019",
  "name": "Renault Clio 5",
  "price": 250,
  "image": "images/clio5.jpg",
  "locationAgency": "Aéroport",
  "createdAt": "2025-11-07T14:00:00.000Z",
  "updatedAt": "2025-11-07T14:00:00.000Z"
}
```

---

#### `PUT /cars/:id`
Update an existing car.

**URL Parameter:**
- `id` (string): Car ID

**Request Body:** (all fields optional)
```json
{
  "name": "Renault Clio 5 Updated",
  "price": 270,
  "image": "images/clio5_new.jpg",
  "locationAgency": "Centre Ville"
}
```

**Response:**
```json
{
  "id": "car1762526985019",
  "name": "Renault Clio 5 Updated",
  "price": 270,
  "image": "images/clio5_new.jpg",
  "locationAgency": "Centre Ville",
  "createdAt": "2025-11-07T14:00:00.000Z",
  "updatedAt": "2025-11-07T14:05:00.000Z"
}
```

---

#### `DELETE /cars/:id`
Delete a car and all its reservations.

**URL Parameter:**
- `id` (string): Car ID

**Response:**
```json
{
  "message": "Car and its reservations deleted successfully"
}
```

---

### Reservations Endpoints

#### `GET /reservations`
Get all reservations, optionally filtered by car.

**Query Parameters:**
- `carId` (optional, string): Filter reservations by car ID

**Examples:**
- Get all: `GET /reservations`
- Filter by car: `GET /reservations?carId=car123`

**Response:**
```json
[
  {
    "id": "69459ad3-7caa-48d7-b6de-94a3fcbf5cb2",
    "carId": "5ef435c0-40a1-4803-8124-e7d49b63b830",
    "startDate": "2025-11-12",
    "endDate": "2025-11-15",
    "departureAgency": "Aéroport",
    "returnAgency": "Centre Ville",
    "customerName": "Ahmed Bennani",
    "customerEmail": "ahmed.bennani@email.com",
    "customerPhone": "0661234567",
    "totalPrice": 750,
    "notes": "Client préférentiel",
    "documents": "{\"cin\":{\"name\":\"cin_ahmed.jpg\"},\"permis\":{\"name\":\"permis_ahmed.jpg\"}}",
    "createdAt": "2025-11-07T14:00:00.000Z",
    "updatedAt": "2025-11-07T14:00:00.000Z"
  }
]
```

---

#### `POST /reservations`
Create a new reservation with conflict validation.

**Request Body:**
```json
{
  "carId": "5ef435c0-40a1-4803-8124-e7d49b63b830",
  "startDate": "2025-12-01",
  "endDate": "2025-12-05",
  "departureAgency": "Aéroport",
  "returnAgency": "Gare",
  "customerName": "Test Customer",
  "customerEmail": "test@example.com",
  "customerPhone": "0612345678",
  "totalPrice": 1000,
  "notes": "Optional notes",
  "documents": "{\"cin\":{\"name\":\"cin.jpg\"},\"permis\":{\"name\":\"permis.jpg\"}}"
}
```

**Required Fields:**
- `carId` (string)
- `startDate` (YYYY-MM-DD)
- `endDate` (YYYY-MM-DD)
- `departureAgency` (string)
- `returnAgency` (string)
- `customerName` (string)
- `customerEmail` (string)

**Optional Fields:**
- `customerPhone` (string)
- `totalPrice` (number) - auto-calculated if not provided
- `notes` (string)
- `documents` (string/JSON)

**Validation:**
- End date must be after start date
- Car must exist
- No overlapping reservations for the same car

**Response:** (201 Created)
```json
{
  "id": "69459ad3-7caa-48d7-b6de-94a3fcbf5cb2",
  "carId": "5ef435c0-40a1-4803-8124-e7d49b63b830",
  "startDate": "2025-12-01",
  "endDate": "2025-12-05",
  "departureAgency": "Aéroport",
  "returnAgency": "Gare",
  "customerName": "Test Customer",
  "customerEmail": "test@example.com",
  "customerPhone": "0612345678",
  "totalPrice": 1000,
  "notes": "Optional notes",
  "documents": "{\"cin\":{\"name\":\"cin.jpg\"},\"permis\":{\"name\":\"permis.jpg\"}}",
  "createdAt": "2025-11-07T14:00:00.000Z",
  "updatedAt": "2025-11-07T14:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid dates
- `404 Not Found`: Car not found
- `409 Conflict`: Reservation overlaps with existing reservation

---

#### `PUT /reservations/:id`
Update an existing reservation.

**URL Parameter:**
- `id` (string): Reservation ID

**Request Body:** (all fields optional)
```json
{
  "customerName": "Updated Name",
  "totalPrice": 1100,
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "id": "69459ad3-7caa-48d7-b6de-94a3fcbf5cb2",
  "carId": "5ef435c0-40a1-4803-8124-e7d49b63b830",
  "startDate": "2025-12-01",
  "endDate": "2025-12-05",
  "departureAgency": "Aéroport",
  "returnAgency": "Gare",
  "customerName": "Updated Name",
  "customerEmail": "test@example.com",
  "customerPhone": "0612345678",
  "totalPrice": 1100,
  "notes": "Updated notes",
  "documents": "{\"cin\":{\"name\":\"cin.jpg\"}}",
  "createdAt": "2025-11-07T14:00:00.000Z",
  "updatedAt": "2025-11-07T14:10:00.000Z"
}
```

---

#### `DELETE /reservations/:id`
Delete a reservation.

**URL Parameter:**
- `id` (string): Reservation ID

**Response:**
```json
{
  "success": true
}
```

**Error Response:**
- `404 Not Found`: Reservation not found

---

## 🛠️ Development Commands

### Start Server
```bash
cd backend
npm start
# or
node server.js
```

### Seed Database
```bash
cd backend
node seed-database.js
```

### View Database
```bash
cd backend
node view-database.js
```

### Test API
```bash
cd backend
node test-api.js
```

### Verify Tables
```bash
cd backend
node verify-tables.js
```

---

## 🌐 Frontend Integration

The frontend automatically connects to the API based on the environment:

**Development (localhost):**
```javascript
API_URL = 'http://localhost:3001'
```

**Production:**
```javascript
API_URL = localStorage.getItem('FANDIRENT_API_URL') || 'http://your-domain.com:3001'
```

### Frontend Files
- `admin.html` - Admin interface (uses all endpoints)
- `index.html` - User interface (uses GET endpoints)
- `config.js` - API URL configuration

---

## 🔐 CORS Configuration

The API accepts requests from all origins:
```javascript
app.use(cors());
```

For production, consider restricting origins:
```javascript
app.use(cors({
  origin: ['https://your-domain.com']
}));
```

---

## 📊 Database Auto-Seeding

The server automatically seeds sample data if the database is empty:
- 5 sample cars
- 10 sample reservations

To disable auto-seeding, comment out this section in `server.js`:
```javascript
// Auto-seed if empty
const carCount = await Car.count();
if (carCount === 0) {
  await seedData();
  console.log('Seeded initial data');
}
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 3001 is already in use
netstat -ano | findstr :3001

# Kill the process if needed
taskkill /PID <PID> /F
```

### Database locked error
```bash
# Delete and recreate database
cd backend
Remove-Item fandicars.db
node seed-database.js
```

### CORS errors
- Ensure the backend is running on port 3001
- Check browser console for CORS errors
- Verify `config.js` has correct API URL

---

## ✅ API Testing Results

All endpoints tested successfully:
- ✅ GET /health - Health check
- ✅ GET /cars - Get all cars
- ✅ POST /cars - Add a car
- ✅ PUT /cars/:id - Update a car
- ✅ DELETE /cars/:id - Delete a car
- ✅ GET /reservations - Get all reservations (optional ?carId filter)
- ✅ POST /reservations - Add a reservation
- ✅ PUT /reservations/:id - Update a reservation
- ✅ DELETE /reservations/:id - Delete a reservation

The backend is fully functional and ready for production use! 🎉
