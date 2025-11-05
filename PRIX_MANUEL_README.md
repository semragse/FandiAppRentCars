# 💵 Fonctionnalité Prix Manuel - Admin

## 📋 Vue d'ensemble

Cette fonctionnalité permet à l'administrateur de **saisir manuellement un prix** pour une réservation, ou de laisser le système calculer automatiquement le prix avec les majorations (week-end, vacances, haute saison).

---

## ✨ Fonctionnalités

### 1. **Champ Prix Manuel (optionnel)**
- Nouveau champ dans le formulaire "Ajouter une réservation"
- Si l'admin saisit un prix → ce prix sera utilisé
- Si le champ est vide → prix calculé automatiquement

### 2. **Validation**
- Le prix manuel doit être supérieur à zéro
- Message d'erreur si prix invalide

### 3. **Aperçu en temps réel**
- Affichage dynamique du prix lors de la saisie
- Indique si le prix est manuel ou calculé automatiquement
- Met à jour automatiquement quand on change les dates ou le prix manuel

---

## 🎯 Utilisation

### Étape 1: Ouvrir le formulaire de réservation
1. Aller sur la page **admin.html**
2. Cliquer sur "Ajouter une réservation" sur une voiture

### Étape 2: Remplir les informations
- Nom du client *
- Email *
- Téléphone
- Date de début *
- Date de fin *

### Étape 3: Choisir le prix

#### Option A: Prix automatique (recommandé)
- **Laisser le champ "Prix Manuel" vide**
- Le système calculera automatiquement le prix avec:
  - Prix de base × nombre de jours
  - Majorations week-end
  - Majorations vacances scolaires
  - Majorations haute saison

#### Option B: Prix manuel
- **Saisir un montant** dans le champ "Prix Manuel (optionnel)"
- Ce prix remplacera le calcul automatique
- Utile pour:
  - Réductions spéciales
  - Offres promotionnelles
  - Tarifs négociés
  - Corrections manuelles

### Étape 4: Vérifier l'aperçu
- La section "💰 Prix de la réservation" affiche:
  - **Prix manuel** (si saisi) avec badge bleu "💵 Prix manuel saisi"
  - **Prix automatique** (si vide) avec détails du calcul "🤖 Calcul automatique"

### Étape 5: Confirmer
- Cliquer sur "✓ Confirmer la réservation"

---

## 🔧 Détails techniques

### Frontend (admin.html)

#### Nouveau champ HTML
```html
<input 
    type="number" 
    id="modalManualPrice" 
    placeholder="Ex: 1500" 
    min="0" 
    step="0.01"
    oninput="updatePricePreview()"
>
```

#### Fonction `submitReservation()` modifiée
```javascript
// Récupérer le prix manuel
const manualPrice = document.getElementById('modalManualPrice').value.trim();

// Validation
if (manualPrice && parseFloat(manualPrice) <= 0) {
    showStatus('Le prix manuel doit être supérieur à zéro!', 'error');
    return;
}

// Déterminer le prix final
let finalPrice;
if (manualPrice && parseFloat(manualPrice) > 0) {
    finalPrice = parseFloat(manualPrice); // Prix manuel
} else {
    finalPrice = calculatePrice(carId, startDate, endDate); // Prix calculé
}
```

#### Fonction `updatePricePreview()` créée
- Affiche le prix en temps réel
- Distingue prix manuel vs calculé
- S'appelle automatiquement lors de la saisie

### Backend (server.js)

Le backend supporte déjà les prix manuels :

```javascript
// Compute price if not provided
let finalPrice = totalPrice;
if (!finalPrice) {
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    finalPrice = car.price * days;
}
```

---

## 🎨 Interface utilisateur

### Champ Prix Manuel
- **Couleur**: Bleu (#667eea) pour se démarquer
- **Bordure**: 2px solid bleu
- **Background**: #f0f7ff (bleu clair)
- **Tooltip**: "ℹ️ Laissez vide pour calcul automatique"
- **Aide**: Texte explicatif sous le champ

### Aperçu du prix
- **Prix manuel**: Badge bleu "💵 Prix manuel saisi"
- **Prix automatique**: Badge robot "🤖 Calcul automatique" + détails

---

## 📊 Exemples

### Exemple 1: Prix automatique
```
Dates: 01/12/2025 → 05/12/2025 (4 jours)
Prix manuel: [vide]
Résultat: 200€/jour × 4 jours = 800€
```

### Exemple 2: Prix manuel - Réduction
```
Dates: 01/12/2025 → 05/12/2025 (4 jours)
Prix manuel: 650€
Résultat: 650€ (prix manuel appliqué)
Économie client: 150€ (réduction de 18.75%)
```

### Exemple 3: Prix manuel - Majoration spéciale
```
Dates: 20/12/2025 → 25/12/2025 (Noël)
Prix manuel: 1500€
Résultat: 1500€ (tarif spécial Noël)
```

---

## ✅ Validation et Sécurité

### Frontend
- ✅ Vérification que le prix est un nombre
- ✅ Vérification que le prix > 0
- ✅ Conversion en float avec 2 décimales
- ✅ Message d'erreur clair si invalide

### Backend
- ✅ Accepte `totalPrice` dans la requête
- ✅ Utilise le prix fourni si présent
- ✅ Calcule automatiquement sinon
- ✅ Validation des champs obligatoires

---

## 🔄 Compatibilité

### Fonctionnalités non affectées
- ✅ Calcul automatique des prix (si champ vide)
- ✅ Vérification des conflits de dates
- ✅ Upload de documents (CIN, Permis, Autre)
- ✅ Notes et commentaires
- ✅ Bouton WhatsApp
- ✅ Suppression de réservation
- ✅ Modification de réservation
- ✅ Responsive design mobile

---

## 📱 Responsive

Le champ prix manuel est **fully responsive** :

- **Desktop**: Champ normal avec aide visible
- **Tablette**: Champ adapté, texte lisible
- **Mobile**: 
  - Champ full-width
  - Font-size 1rem pour clavier mobile
  - Min-height 48px (touch-friendly)
  - Aide condensée

---

## 🐛 Résolution de problèmes

### Le prix ne s'affiche pas
- Vérifier que les dates sont valides
- Vérifier que date fin > date début
- Ouvrir la console (F12) pour voir les erreurs

### Le prix manuel n'est pas pris en compte
- Vérifier que le champ contient un nombre valide
- Vérifier que le nombre est > 0
- Vérifier la console pour les erreurs de validation

### L'aperçu ne se met pas à jour
- Vérifier que `oninput="updatePricePreview()"` est présent
- Vérifier que les event listeners sont bien attachés
- Rafraîchir la page (Ctrl+F5)

---

## 📝 Notes pour les développeurs

### Fichiers modifiés
- `admin.html` (lignes ~1105-1145, ~1935-2035, ~1873-1965)

### Fonctions ajoutées
- `updatePricePreview()` - Affiche le prix en temps réel

### Fonctions modifiées
- `submitReservation()` - Gestion du prix manuel
- `openReservationModal()` - Reset du champ prix manuel

### Variables ajoutées
- `modalManualPrice` (input field)

---

## 🎓 Bonnes pratiques

### Quand utiliser le prix manuel ?
✅ **OUI**:
- Réductions spéciales (clients VIP, fidélité)
- Offres promotionnelles (-20%, -30%)
- Tarifs négociés (longue durée)
- Corrections d'erreurs
- Événements spéciaux (mariages, etc.)

❌ **NON**:
- Réservations normales → utiliser calcul auto
- Si vous ne savez pas → laisser vide

### Recommandations
1. **Documenter** les prix manuels dans les notes
2. **Justifier** les réductions importantes
3. **Vérifier** le calcul automatique avant override
4. **Communiquer** au client le tarif final

---

## 📞 Support

Pour toute question ou problème:
- Email: admin@fandirent.ma
- WhatsApp: +212 6 00 00 00 00

---

**Version**: 1.0  
**Date**: Novembre 2025  
**Auteur**: FandiRent Team
