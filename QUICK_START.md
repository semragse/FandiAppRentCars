# 🚀 Quick Start Guide - FandiApp Backend

## ✅ Everything is Ready!

Your backend API is fully configured and working with SQLite database.

## 🎯 Current Status

- ✅ **Backend Server**: Running on http://localhost:3001
- ✅ **Database**: `fandicars.db` with 5 cars and 5 reservations
- ✅ **API Endpoints**: All 9 endpoints tested and working
- ✅ **Frontend**: Ready to use (`admin.html` and `index.html`)

## 🚀 Quick Start (3 Steps)

### 1. Start Backend (If Not Running)

**Using VS Code:**
- Press `Ctrl+Shift+P`
- Type: "Tasks: Run Task"
- Select: "Start Backend Server"

**Using Terminal:**
```bash
cd backend
npm start
```

### 2. Open Admin Interface

Open in browser: `admin.html`

**Features:**
- ➕ Add new cars
- ✏️ Edit existing cars
- 🗑️ Delete cars
- 📅 Manage reservations
- 👥 View customer details

### 3. Open User Interface

Open in browser: `index.html`

**Features:**
- 🚗 Browse available cars
- 📅 Check availability
- 💰 View prices

## 📚 API Endpoints Reference

### Cars
```
GET    /cars           - Get all cars
POST   /cars           - Add a car
PUT    /cars/:id       - Update a car
DELETE /cars/:id       - Delete a car
```

### Reservations
```
GET    /reservations           - Get all reservations
GET    /reservations?carId=X   - Get reservations for a car
POST   /reservations           - Create a reservation
PUT    /reservations/:id       - Update a reservation
DELETE /reservations/:id       - Delete a reservation
```

### Health Check
```
GET    /health         - Check server status
```

## 🛠️ Useful Commands

### Re-seed Database
```bash
cd backend
node seed-database.js
```
*Resets database to 5 sample cars and 5 reservations*

### View Database Content
```bash
cd backend
node view-database.js
```
*Shows all cars and reservations in console*

### Test All API Endpoints
```bash
cd backend
node test-api.js
```
*Runs comprehensive API tests*

### Verify Database Schema
```bash
cd backend
node verify-tables.js
```
*Shows table structure and record counts*

## 📋 Sample Data

### Cars in Database
1. **Renault Clio 5** - 250 DH/jour @ Aéroport
2. **Dacia Logan** - 200 DH/jour @ Centre Ville
3. **Peugeot 208** - 280 DH/jour @ Gare
4. **Volkswagen Golf** - 350 DH/jour @ Agence Principale
5. **Toyota Yaris** - 270 DH/jour @ Aéroport

### Available Agencies
- Aéroport
- Centre Ville
- Gare
- Agence Principale

## 🔧 Configuration

### API URL (Frontend)
The frontend automatically uses the correct API URL:

- **Development**: `http://localhost:3001`
- **Production**: Set via `localStorage.setItem('FANDIRENT_API_URL', 'your-url')`

### Environment Variables
Create `.env` file in `backend/` folder:
```
PORT=3001
SQLITE_STORAGE=fandicars.db
```

## 🐛 Troubleshooting

### Server won't start
```bash
# Kill existing node processes
taskkill /F /IM node.exe /T

# Restart server
cd backend
npm start
```

### Database issues
```bash
# Reset database
cd backend
Remove-Item fandicars.db
node seed-database.js
```

### Port already in use
Change port in `.env` or `server.js`:
```javascript
const PORT = process.env.PORT || 3002;
```

## 📖 Documentation

- **Complete API Docs**: `backend/API_DOCUMENTATION.md`
- **Integration Summary**: `backend/INTEGRATION_SUMMARY.md`
- **SQLite Setup**: `backend/SQLITE_SETUP.md`

## ✨ What's Working

✅ **Database**
- SQLite with auto-sync
- Cars table with location agencies
- Reservations table with departure/return agencies

✅ **API Features**
- CRUD operations for cars and reservations
- Conflict detection for overlapping reservations
- Auto price calculation
- Cascade delete (car → reservations)
- Document storage support

✅ **Frontend Integration**
- Admin interface fully functional
- User interface ready
- Auto-configuration for dev/prod

## 🎉 You're All Set!

Your FandiApp backend is production-ready with SQLite database!

**Next Steps:**
1. ✅ Backend is running
2. 📂 Open `admin.html` to manage cars/reservations
3. 🌐 Open `index.html` for user view
4. 🖼️ Add real car images to `images/` folder
5. 🚀 Deploy when ready!

---

**Need Help?** Check the documentation files in `backend/` folder.
