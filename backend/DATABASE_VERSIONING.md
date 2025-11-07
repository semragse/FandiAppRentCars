# 📦 Database Versioning Guide

## Overview

The SQLite database file (`fandicars.db`) is **version-controlled with Git** to ensure data consistency across different commits and branches.

## ✅ Current Setup

### Database Location
```
backend/fandicars.db
```

### Version Control Status
- ✅ **Tracked by Git**: Yes
- ✅ **Committed**: Yes (commit 0bf9b22)
- ✅ **Not in .gitignore**: Correct

### Current Database State
- **5 Cars**: With different brands, prices, and location agencies
- **5 Reservations**: With complete customer details and agency information
- **Schema Version**: Latest (with departure/return agency fields)

## 🔄 How Database Versioning Works

### When You Switch Commits

**Scenario 1: Switch to a Newer Commit**
```bash
git checkout <newer-commit>
```
- The database file will be **updated** to the version in that commit
- If the newer commit has schema changes, they will be reflected
- Sample data will match what was committed

**Scenario 2: Switch to an Older Commit**
```bash
git checkout <older-commit>
```
- The database file will be **reverted** to the older version
- Schema might be different (e.g., no agency fields)
- Sample data will be from that point in time

**Scenario 3: Switch Branches**
```bash
git checkout feature-branch
```
- Database follows the branch's version
- Each branch can have different database states

## 🛠️ Managing Database Changes

### After Switching Commits

If you switch commits and the database schema changes, you may need to:

1. **Re-seed the database** (if data is corrupted):
   ```bash
   cd backend
   node seed-database.js
   ```

2. **Verify the database** (check schema and data):
   ```bash
   cd backend
   node verify-tables.js
   node view-database.js
   ```

3. **Test the API** (ensure everything works):
   ```bash
   cd backend
   node test-api.js
   ```

### Creating a New Database Version

When you make schema changes:

1. **Update the models** (`backend/models/car.js`, `backend/models/reservation.js`)

2. **Delete the old database**:
   ```bash
   cd backend
   Remove-Item fandicars.db
   ```

3. **Create new database with seed data**:
   ```bash
   node seed-database.js
   ```

4. **Test the new schema**:
   ```bash
   node verify-tables.js
   node test-api.js
   ```

5. **Commit the new database**:
   ```bash
   git add backend/fandicars.db
   git commit -m "Update database schema: <describe changes>"
   ```

## 📊 Database Schema History

### Current Version (commit 0bf9b22)

**Cars Table:**
- `id` (PRIMARY KEY)
- `name` (VARCHAR NOT NULL)
- `price` (INTEGER NOT NULL)
- `image` (VARCHAR)
- `location_agency` (VARCHAR NOT NULL) ← Agency field
- `createdAt`, `updatedAt` (DATETIME)

**Reservations Table:**
- `id` (PRIMARY KEY)
- `carId` (VARCHAR NOT NULL, FOREIGN KEY)
- `startDate` (DATE NOT NULL)
- `endDate` (DATE NOT NULL)
- `departure_agency` (VARCHAR NOT NULL) ← **NEW**: Departure agency
- `return_agency` (VARCHAR NOT NULL) ← **NEW**: Return agency
- `customerName` (VARCHAR NOT NULL)
- `customerEmail` (VARCHAR NOT NULL)
- `customerPhone` (VARCHAR)
- `totalPrice` (INTEGER NOT NULL)
- `notes` (TEXT)
- `documents` (TEXT)
- `createdAt`, `updatedAt` (DATETIME)

### Previous Version (commit 1c289a0)
- Same schema as current (agencies added in this commit)

### Earlier Versions
- Basic schema without agency fields

## ⚠️ Important Notes

### DO Version Control
✅ **Version the database** when:
- Schema changes (adding/removing columns)
- Adding important sample data
- Creating milestone versions
- Before major refactoring

### DON'T Version Control
❌ **Don't version** when:
- Making temporary test data
- Database grows too large (>10MB)
- Frequent user data changes (use migrations instead)

### Database Size Management

Current size: ~28KB (very manageable)

If database grows large:
1. Consider using **migrations** instead of versioning the whole file
2. Keep only **essential sample data** in version control
3. Create a separate **seed script** for generating large datasets
4. Add `*.db` to `.gitignore` and use migrations

## 🔧 Best Practices

### 1. Always Seed After Major Changes
```bash
# After pulling changes or switching branches
cd backend
node seed-database.js  # Reset to known state
```

### 2. Verify Before Committing
```bash
# Before committing database changes
node verify-tables.js  # Check schema
node view-database.js  # Check data
node test-api.js       # Test API
```

### 3. Document Schema Changes
```bash
# Descriptive commit messages
git commit -m "Add agency fields to reservations table"
```

### 4. Use Branches for Experiments
```bash
# Create a feature branch for database changes
git checkout -b feature/new-schema
# Make changes, test, then merge
```

## 🚀 Workflow Examples

### Example 1: Working on a Feature

```bash
# 1. Create feature branch
git checkout -b feature/add-payment-tracking

# 2. Modify schema (edit models/reservation.js)
# Add payment fields...

# 3. Regenerate database
cd backend
Remove-Item fandicars.db
node seed-database.js

# 4. Verify changes
node verify-tables.js
node test-api.js

# 5. Commit changes
git add backend/fandicars.db backend/models/reservation.js
git commit -m "Add payment tracking to reservations"

# 6. Merge to main
git checkout main
git merge feature/add-payment-tracking
```

### Example 2: Reviewing Old Code

```bash
# 1. Check out old commit
git checkout 1c289a0

# 2. Database automatically reverts to that version

# 3. Run the old code
cd backend
npm start

# 4. Return to latest
git checkout main

# 5. Database updates to current version
```

### Example 3: Collaborating with Team

```bash
# 1. Pull changes from remote
git pull origin main

# 2. If database changed, it's automatically updated

# 3. Re-seed if needed
cd backend
node seed-database.js

# 4. Continue working with latest database
```

## 🔍 Troubleshooting

### Problem: Database Locked Error
**Solution:**
```bash
# Stop the backend server
taskkill /F /IM node.exe /T

# Delete and recreate
cd backend
Remove-Item fandicars.db
node seed-database.js
```

### Problem: Schema Mismatch After Switching
**Solution:**
```bash
# The database should match the commit
# If issues persist, re-seed:
cd backend
node seed-database.js
```

### Problem: Merge Conflicts with Database
**Solution:**
```bash
# Accept one version
git checkout --theirs backend/fandicars.db
# OR
git checkout --ours backend/fandicars.db

# Then re-seed to ensure consistency
node seed-database.js
```

### Problem: Database Too Large
**Solution:**
```bash
# 1. Add to .gitignore
echo "backend/*.db" >> .gitignore

# 2. Remove from Git (keep local copy)
git rm --cached backend/fandicars.db

# 3. Commit the change
git commit -m "Stop tracking large database file"

# 4. Use migrations instead (see migrations guide)
```

## 📚 Related Documentation

- **SQLITE_SETUP.md** - Initial setup guide
- **API_DOCUMENTATION.md** - API endpoints reference
- **INTEGRATION_SUMMARY.md** - Integration overview
- **QUICK_START.md** - Quick start guide

## 🎯 Summary

✅ **Database is version-controlled**: `fandicars.db` is tracked in Git
✅ **Automatic updates**: Switching commits updates the database automatically
✅ **Reset anytime**: Use `node seed-database.js` to reset to known state
✅ **Schema history**: Each commit has its own database version
✅ **Conflict resolution**: Use re-seeding to resolve database conflicts

**Current Commit**: `0bf9b22` - Full SQLite database with agency fields

---

**Last Updated**: November 7, 2025
**Database Version**: 1.0 (with agency fields)
**Schema**: Cars + Reservations with agencies
