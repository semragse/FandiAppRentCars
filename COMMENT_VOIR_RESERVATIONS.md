# Comment Voir les Réservations dans FandiRent

## 📍 Où voir les réservations ?

### 1. **Page Calendrier des Réservations** ⭐ RECOMMANDÉ
**Fichier:** `reservations-calendar.html`

**Comment l'ouvrir:**
- Double-cliquez sur `reservations-calendar.html` 
- OU ouvrez: `http://localhost:5500/reservations-calendar.html`

**Ce que vous voyez:**
- ✅ Toutes les voitures avec leurs réservations
- ✅ Statut coloré: En cours / À venir / Terminée
- ✅ Détails: client, dates, durée, prix
- ✅ Tri chronologique par voiture
- ✅ Rafraîchissement automatique toutes les 10 secondes

---

### 2. **Page Admin**
**Fichier:** `admin.html`

**Comment l'ouvrir:**
- Double-cliquez sur `admin.html`
- OU ouvrez: `http://localhost:5500/admin.html`

**Ce que vous pouvez faire:**
- ✅ Voir toutes les réservations
- ✅ Ajouter de nouvelles réservations manuellement
- ✅ Supprimer des réservations
- ✅ Nettoyer toutes les réservations d'aujourd'hui

---

### 3. **Via API (pour développeurs)**
**Nécessite:** Serveur backend démarré

**Démarrer le serveur:**
```powershell
cd backend
npm start
```

**Endpoints disponibles:**
```
GET http://localhost:3001/reservations
GET http://localhost:3001/reservations?carId=car1
GET http://localhost:3001/cars
```

**Exemple avec PowerShell:**
```powershell
Invoke-RestMethod -Method Get http://localhost:3001/reservations
```

---

### 4. **Dans la Page Principale** (recherche de disponibilité)
**Fichier:** `index.html`

**Comment tester:**
1. Ouvrez `index.html`
2. Utilisez la recherche par dates dans le panneau gauche
3. Les voitures réservées pour ces dates seront cachées
4. Seules les voitures disponibles s'affichent

---

## 🚀 Démarrage Rapide

### Pour voir les réservations MAINTENANT (sans backend):
1. Ouvre `admin.html` dans ton navigateur
2. Les réservations d'exemple sont déjà chargées en mémoire

### Pour voir avec la base de données réelle:
1. Démarre le backend:
   ```powershell
   cd backend
   npm start
   ```
2. Ouvre `reservations-calendar.html`

---

## 📊 Exemple de Données

Les réservations d'exemple actuelles:
- **Clio 5**: 10-12 nov, 18-19 nov
- **Audi A4**: 13-16 nov
- **Mercedes CLA 220**: 20-25 nov  
- **Dacia Logan**: 6-8 nov
- **Peugeot 308**: 5-10 déc

---

## 🔧 Dépannage

### "Impossible de charger les réservations"
➡️ Le serveur backend n'est pas démarré
**Solution:** `cd backend && npm start`

### "Aucune réservation affichée"
➡️ La base de données est vide
**Solution:** Utilisez le bouton "Seed" dans `admin.html`

### Les dates ne se mettent pas à jour
➡️ Rafraîchissez la page (F5)

---

## 📁 Fichiers Créés

- `reservations-calendar.html` - Vue calendrier complète
- `admin.html` - Gestion des réservations (déjà existant)
- `index.html` - Page principale avec recherche

---

**Recommandation:** Utilisez `reservations-calendar.html` pour une vue d'ensemble claire de toutes les réservations ! 🎯
