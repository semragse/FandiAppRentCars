# SQLite Database Setup - FandiAuto

## ✅ Configuration Complete

Your backend is now fully configured to use **SQLite** instead of PostgreSQL.

---

## 📋 What Was Done

### 1. **SQLite Package Installed**
- ✅ `sqlite3@5.1.7` is installed
- ✅ No PostgreSQL dependencies (`pg`, `pg-hstore` removed)

### 2. **Database File Created**
- ✅ Database file: `fandicars.db`
- ✅ Location: `backend/fandicars.db`
- ✅ Size: ~20KB (empty database with schema)
- ✅ Tables created: `cars` and `reservations`

### 3. **Backend Configuration Updated**
- ✅ `models/index.js` - Uses SQLite with `fandicars.db`
- ✅ `.env.example` - Updated with SQLite configuration
- ✅ Removed all PostgreSQL connection code

### 4. **Reusable Database Connection**
The database connection is managed by Sequelize and is reusable across your entire backend:

```javascript
const { sequelize, Car, Reservation } = require('./models');

// Connection is automatically managed
// Use Car and Reservation models anywhere in your app
```

---

## 🗄️ Database Schema

### **Cars Table**
| Field          | Type    | Constraints      |
|----------------|---------|------------------|
| id             | STRING  | PRIMARY KEY      |
| name           | STRING  | NOT NULL         |
| price          | INTEGER | NOT NULL         |
| image          | STRING  | NULLABLE         |
| locationAgency | STRING  | NOT NULL         |

### **Reservations Table**
| Field           | Type     | Constraints      |
|-----------------|----------|------------------|
| id              | STRING   | PRIMARY KEY      |
| carId           | STRING   | FOREIGN KEY, NOT NULL |
| startDate       | DATEONLY | NOT NULL         |
| endDate         | DATEONLY | NOT NULL         |
| departureAgency | STRING   | NOT NULL         |
| returnAgency    | STRING   | NOT NULL         |
| customerName    | STRING   | NOT NULL         |
| customerEmail   | STRING   | NOT NULL         |
| customerPhone   | STRING   | NULLABLE         |
| totalPrice      | INTEGER  | NOT NULL         |
| notes           | TEXT     | NULLABLE         |
| documents       | TEXT     | NULLABLE         |
| createdAt       | DATE     | AUTO             |

---

## 🚀 How to Use

### **Start the Backend Server**
```powershell
cd backend
npm start
```

The server will:
1. Connect to `fandicars.db`
2. Auto-sync schema (create/update tables)
3. Auto-seed sample data if database is empty
4. Start API on `http://localhost:3001`

### **Test SQLite Connection**
```powershell
cd backend
node test-sqlite-connection.js
```

### **Seed Sample Data**
```powershell
cd backend
npm run seed
```

---

## 📂 Database File Location

```
backend/
├── fandicars.db          ← Your SQLite database file
├── models/
│   ├── index.js          ← Database connection setup
│   ├── car.js            ← Car model
│   └── reservation.js    ← Reservation model
└── server.js             ← API endpoints
```

---

## 🔧 Connection Details

**File:** `backend/models/index.js`

```javascript
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fandicars.db',  // Database file name
  logging: false,           // Disable SQL logging
});
```

**Environment Variable (optional):**
You can override the database filename via `.env`:

```bash
SQLITE_STORAGE=fandicars.db
PORT=3001
```

---

## ✅ Verification Checklist

- [x] SQLite3 package installed
- [x] PostgreSQL packages removed
- [x] `fandicars.db` created successfully
- [x] Tables `cars` and `reservations` created
- [x] Connection test passed
- [x] Backend can connect and use the database
- [x] Database connection is reusable across all API endpoints

---

## 📊 API Endpoints

All endpoints automatically use the SQLite database:

- **GET** `/cars` - Get all cars
- **POST** `/cars` - Add a new car
- **PUT** `/cars/:id` - Update a car
- **DELETE** `/cars/:id` - Delete a car
- **GET** `/reservations` - Get all reservations
- **POST** `/reservations` - Create a reservation
- **PUT** `/reservations/:id` - Update a reservation
- **DELETE** `/reservations/:id` - Delete a reservation

---

## 🎯 Benefits of SQLite

✅ **No server setup required** - Just a file  
✅ **Portable** - Copy `fandicars.db` to backup/restore  
✅ **Fast** - Great for local development  
✅ **Zero configuration** - Works out of the box  
✅ **Perfect for small to medium apps** - Handles thousands of records efficiently

---

## 🛠️ Troubleshooting

**Database file not created?**
- Run `node test-sqlite-connection.js` to create it

**Connection errors?**
- Check that `sqlite3` is installed: `npm list sqlite3`
- Verify `models/index.js` uses `fandicars.db`

**Need to reset database?**
1. Stop the backend server
2. Delete `fandicars.db`
3. Restart server (auto-creates new database)

---

**Your SQLite backend is ready! 🎉**
