# 🏗️ Architecture & Cohérence - FandiRent

## 📊 Vue d'ensemble

Ce document explique comment toutes les parties du système sont synchronisées et cohérentes.

---

## 🔄 Flux de Données

### 1. Source de Vérité Unique : Backend SQLite Database

```
┌──────────────────────────────────────────────┐
│         SQLite Database (backend/)           │
│  ┌────────────────┐  ┌─────────────────────┐│
│  │  Table: cars   │  │  Table: reservations││
│  │  - id          │  │  - id               ││
│  │  - name        │  │  - carId            ││
│  │  - price       │  │  - startDate        ││
│  │  - image       │  │  - endDate          ││
│  └────────────────┘  │  - customerName     ││
│                      │  - totalPrice       ││
│                      └─────────────────────┘│
└──────────────────────────────────────────────┘
           ↓
    Express API (server.js)
           ↓
    ┌─────┴─────┬────────────┬──────────────┐
    ↓           ↓            ↓              ↓
index.html  admin.html  payment.html  reservations-calendar.html
```

---

## 🎯 Système de Calcul de Prix Unifié

### **carPricing.js** - Module Centralisé

Utilisé par TOUTES les pages pour garantir la cohérence des calculs :

```javascript
calculateCarPriceWithWeekend(carId, startDate, endDate, applyDiscount=true)
```

#### Sources de données (par ordre de priorité) :
1. **window.carsDatabase** (index.html) - Voitures chargées dynamiquement depuis API
2. **window.cars** (admin.html) - Voitures chargées dynamiquement depuis API
3. **CAR_RATES** (fallback) - 5 voitures par défaut si API indisponible

#### Fonctionnalités :
- ✅ Tarif de base par voiture
- ✅ Majoration weekend +20%
- ✅ Réductions longue durée automatiques :
  - 4-7 jours : **-10%**
  - 8-14 jours : **-15%**
  - 15+ jours : **-20%**
- ✅ Détail jour par jour avec badges weekend
- ✅ Compatible avec voitures ajoutées dynamiquement via admin

---

## 📱 Pages et Synchronisation

### **index.html** - Page Utilisateur

#### Chargement des voitures :
```javascript
async function loadCarsFromAPI() {
  // Fetch depuis http://localhost:3001/cars
  // Stocke dans window.carsDatabase (global)
  // Affiche dynamiquement les cartes
}
```

#### Composition de la grille :
- **Voitures dynamiques** (du backend) → Réservables ✅
- **6 voitures statiques** (hardcodées) → "Bientôt disponible" (non réservables)

#### Calcul de prix :
- Utilise `carPricing.js` via `window.carsDatabase`
- Affiche : tarif journalier + sous-total + réduction + total
- Modal de réservation rapide avec prévisualisation

---

### **admin.html** - Panneau Admin

#### Fonctionnalités :
- CRUD complet sur voitures (Create, Read, Update, Delete)
- Gestion des réservations
- Preview prix avec réductions
- Possibilité de désactiver les réductions (prix manuel)

#### Synchronisation :
```javascript
window.cars // Chargé depuis GET /cars
carPricing.js utilise window.cars pour calculs
```

#### Avertissement prix manuel :
> ⚠️ Les réductions automatiques sont désactivées avec un prix manuel

---

### **payment.html** - Page de Paiement

#### Données reçues (URL params) :
```
?carId=car1&start=2025-11-10&end=2025-11-15&days=5&total=175
```

#### Validation :
- Vérifie que les données sont présentes
- Charge les infos de la voiture depuis API
- Affiche le résumé complet

#### Soumission :
```javascript
POST /reservations
{
  carId, startDate, endDate,
  customerName, customerEmail, customerPhone,
  totalPrice, notes
}
```

---

### **reservations-calendar.html** - Calendrier

#### ✅ CORRIGÉ - Maintenant 100% Dynamique

Avant :
```javascript
const cars = [ /* hardcodé */ ];
```

Après :
```javascript
let cars = []; // Chargé depuis API
async function loadReservations() {
  cars = await fetch('/cars');
  // Puis charge les réservations
}
```

#### Rafraîchissement :
- Au chargement de la page
- Toutes les 10 secondes (auto-refresh)

---

## 🔐 Cohérence des Données

### Voitures par Défaut (5)

Définies à **3 endroits** mais **identiques** :

1. **backend/seed.js** - Seed initial de la DB
2. **backend/server.js** - Auto-seed si DB vide
3. **carPricing.js** - Fallback CAR_RATES

```javascript
// Toujours les mêmes 5 voitures :
car1: Clio 5 (35€)
car2: Audi A4 (85€)
car3: Mercedes CLA 220 (120€)
car4: Dacia Logan (45€)
car5: Peugeot 308 (65€)
```

### Images

Format cohérent partout :
```
images/[NomVoiture].jpg
```

Exemples :
- `images/clio5.jpg`
- `images/Alfa Romeo.jpg` (nouvelles voitures)

Gestion du placeholder si image manquante :
```javascript
// createCarCard() dans index.html
img.onerror = function() {
  // Affiche un gradient violet avec emoji 🚗
}
```

---

## 🎨 Système de Thème Unifié

### **theme.js** - Géré partout

Pages avec Dark/Light mode :
- ✅ index.html
- ✅ admin.html
- ✅ payment.html

Persistance :
```javascript
localStorage.setItem('theme', 'dark'); // ou 'light'
```

Variables CSS :
```css
:root { --bg-primary: #ffffff; }
body.dark-theme { --bg-primary: #1a1a2e; }
```

---

## 🔄 Workflow Complet

### Ajout d'une voiture par admin :

```
1. Admin clique "Ajouter voiture" dans admin.html
2. Remplit : nom, prix, image
3. POST /cars → SQLite database
4. API retourne la nouvelle voiture
5. admin.html recharge la liste (GET /cars)
6. ✅ index.html la voit au refresh (loadCarsFromAPI)
7. ✅ reservations-calendar.html la voit (loadReservations)
8. ✅ carPricing.js peut la calculer (via window.carsDatabase)
```

### Création d'une réservation :

```
1. User clique "Réserver" sur index.html
2. Modal s'ouvre avec calcul prix (carPricing.js)
   → Affiche : tarif + weekend + réduction
3. Clique "Aller au paiement"
4. Redirigé vers payment.html avec params
5. Remplit formulaire client
6. POST /reservations → SQLite
7. Validation overlap backend
8. ✅ Réservation créée
9. ✅ Visible dans admin.html
10. ✅ Visible dans reservations-calendar.html
```

---

## ✅ Checklist de Cohérence

- [x] Toutes les pages chargent les voitures depuis l'API
- [x] Calcul de prix centralisé (carPricing.js)
- [x] Réductions longue durée appliquées partout
- [x] Majoration weekend +20% cohérente
- [x] Voitures par défaut identiques (seed.js, server.js, CAR_RATES)
- [x] Images gérées uniformément
- [x] Thème Dark/Light sur toutes les pages
- [x] Backend = source de vérité unique
- [x] Validation overlap côté backend
- [x] Event listeners propres (pas de onclick inline)
- [x] window.carsDatabase global pour carPricing.js

---

## 🚀 Architecture Finale

```
Frontend (Client)
├── index.html          → Catalogue + Réservation rapide
├── admin.html          → CRUD voitures + réservations
├── payment.html        → Formulaire paiement
├── reservations-calendar.html → Vue calendrier
├── carPricing.js       → Calcul prix unifié ⭐
└── theme.js           → Dark/Light mode

Backend (Server)
├── server.js          → API REST Express
├── models/
│   ├── car.js        → Modèle Car (Sequelize)
│   ├── reservation.js → Modèle Reservation
│   └── index.js      → Export DB
└── database.sqlite   → Source de vérité unique ⭐

API Endpoints
├── GET    /cars
├── POST   /cars
├── PUT    /cars/:id
├── DELETE /cars/:id
├── GET    /reservations?carId=...
├── POST   /reservations (avec validation overlap)
└── DELETE /reservations/:id
```

---

## 📝 Notes Importantes

1. **Toujours démarrer le backend** :
   ```bash
   cd backend; npm start
   ```

2. **Les voitures statiques dans index.html** :
   - BMW X3, VW Golf, Toyota Corolla, Hyundai i20, Ford Focus, Seat Ibiza
   - Affichées après les voitures du backend
   - Boutons désactivés ("Bientôt disponible")
   - Purement décoratives

3. **Fallback si API down** :
   - index.html affiche 5 voitures par défaut
   - carPricing.js utilise CAR_RATES
   - Les fonctionnalités de base restent opérationnelles

4. **Images manquantes** :
   - Placeholder automatique avec gradient violet
   - Emoji 🚗 + nom de la voiture
   - Pas de broken image

---

## 🎯 Conclusion

**Le système est maintenant 100% cohérent et synchronisé !**

✅ Une seule source de vérité (SQLite)  
✅ Calcul de prix unifié  
✅ Synchronisation temps réel  
✅ Thème cohérent partout  
✅ Gestion d'erreurs robuste  

**Tout fonctionne de manière logique et professionnelle ! 🚗✨**
