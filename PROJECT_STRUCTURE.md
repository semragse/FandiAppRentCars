# 📁 FandiApp Project Structure

## Overview
Clean and organized project structure for the FandiApp car rental application.

## 📂 Directory Structure

```
FandiApp.1/
│
├── 📁 public/                    # Public-facing files (served by Express)
│   ├── 📄 index.html             # Main landing page
│   ├── 📄 admin.html             # Admin dashboard
│   ├── 📄 admin-login.html       # Admin login page
│   ├── 📄 payment.html           # Payment selection page
│   ├── 📄 paypal-payment.html    # PayPal payment page
│   ├── 📄 card-payment.html      # Stripe card payment page
│   ├── 📄 bank-transfer.html     # Bank transfer page
│   ├── 📄 new-reservations.html  # New reservations management
│   ├── 📄 payment-settings.html  # Payment settings admin
│   ├── 📄 reservations-calendar.html  # Calendar view
│   ├── 📄 test-contact.html      # Contact info test page
│   ├── 🖼️ favicon.ico            # Site favicon
│   │
│   ├── 📁 js/                    # JavaScript files
│   │   ├── config.js             # API configuration
│   │   ├── theme.js              # Dark/Light theme handler
│   │   ├── contact-info.js       # Contact information handler
│   │   └── carPricing.js         # Car pricing calculations
│   │
│   ├── 📁 images/                # Image assets
│   │   ├── clio5.jpg
│   │   ├── audia4.jpg
│   │   ├── Mercedes CLA 220.jpg
│   │   └── ... (other car images)
│   │
│   └── 📁 pages/                 # Additional pages
│       ├── contact.html
│       ├── conditions.html
│       ├── faq.html
│       └── ma-reservation.html
│
├── 📁 backend/                   # Backend code and configuration
│   ├── 📄 package.json           # Backend dependencies
│   ├── 📄 seed.js                # Database seeding script
│   ├── 📄 pricingClio5.js        # Clio 5 pricing logic
│   ├── 📄 .env                   # Environment variables (not in git)
│   ├── 📄 .env.example           # Example environment variables
│   ├── 📄 fandicars.db           # SQLite database (development)
│   │
│   ├── 📁 models/                # Sequelize models
│   │   ├── index.js              # Database connection & models loader
│   │   ├── car.js                # Car model
│   │   ├── reservation.js        # Reservation model with payment tracking
│   │   ├── setting.js            # Settings model
│   │   └── paymentSettings.js   # Payment settings model
│   │
│   ├── 📁 config/                # Configuration files
│   │   └── stripe.js             # Stripe configuration
│   │
│   ├── 📁 routes/                # API routes (if needed)
│   │   └── paymentSettings.js
│   │
│   └── 📁 services/              # Business logic services
│
├── 📁 netlify/                   # Netlify serverless functions
│   └── 📁 functions/
│       └── api.js                # Serverless API for Netlify deployment
│
├── 📁 docs/                      # Documentation
│   ├── 📄 README.md              # Main documentation
│   ├── 📄 QUICK_START.md         # Quick start guide
│   ├── 📄 DEPLOY.md              # Deployment guide
│   ├── 📄 NETLIFY_SETUP.md       # Netlify setup instructions
│   ├── 📄 RAILWAY_SETUP.md       # Railway setup instructions
│   ├── 📄 PROJECT_ROADMAP.md     # Project roadmap
│   ├── 📄 ARCHITECTURE_COHERENCE.md
│   ├── 📄 DATABASE_SETUP_COMPLETE.md
│   │
│   └── 📁 backend/               # Backend documentation
│       ├── API_DOCUMENTATION.md
│       ├── INTEGRATION_SUMMARY.md
│       ├── DATABASE_VERSIONING.md
│       └── SQLITE_SETUP.md
│
├── 📁 scripts/                   # Utility scripts
│   ├── test-api.js
│   ├── test-server.js
│   ├── test-sqlite-connection.js
│   ├── check-all-reservations.js
│   ├── check-car4.js
│   ├── view-database.js
│   ├── verify-tables.js
│   ├── add-random-reservations.js
│   ├── generate-reservations-per-car.js
│   └── seed-database.js
│
├── 📁 .vscode/                   # VS Code settings
│   ├── settings.json
│   └── tasks.json
│
├── 📄 server.js                  # Main Express server
├── 📄 package.json               # Root package.json
├── 📄 package-lock.json          # Dependency lock file
├── 📄 .env                       # Environment variables (not in git)
├── 📄 .gitignore                 # Git ignore rules
├── 📄 netlify.toml               # Netlify configuration
├── 📄 railway.toml               # Railway configuration
├── 📄 Procfile                   # Process file for deployment
├── 📄 .railway                   # Railway setup info
└── 📄 .railwayignore             # Railway ignore rules

```

## 🚀 Key Features

### Public Folder Structure
- All user-facing files are in `public/`
- JavaScript files organized in `public/js/`
- Images organized in `public/images/`
- Additional pages in `public/pages/`

### Backend Organization
- Models follow Sequelize ORM patterns
- Configuration files in dedicated `config/` folder
- Clean separation of concerns

### Documentation
- All `.md` files consolidated in `docs/`
- Backend-specific docs in `docs/backend/`

### Scripts
- Test and utility scripts moved to `scripts/`
- Keeps root directory clean

## 🔧 Usage

### Development
```bash
# Start the server (from root)
npm start

# Server runs on http://localhost:3001
# Serves files from public/ folder automatically
```

### File Paths
All paths in HTML files are relative to the `public/` folder:
- JS files: `<script src="js/config.js"></script>`
- Images: `<img src="images/clio5.jpg">`
- Pages: `<a href="pages/contact.html">`

## 📝 Notes

- The `server.js` serves static files from the `public/` folder
- Environment variables are in `.env` (not tracked by git)
- Database file `fandicars.db` is in `backend/` folder
- All documentation is centralized in `docs/`

## 🎯 Benefits of This Structure

1. **Clear Separation**: Public vs Backend vs Docs vs Scripts
2. **Easy Navigation**: Logical folder structure
3. **Production Ready**: Clean deployment structure
4. **Maintainable**: Easy to find and update files
5. **Scalable**: Room for growth in each section
