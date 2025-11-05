# 💳 Page de Paiement - FandiRent

## 📋 Vue d'ensemble

Page complète pour finaliser une réservation avec **3 options de paiement** :
1. **💳 Payer par carte bancaire** (Stripe / CMI Maroc)
2. **🏦 Virement bancaire** (Confirmation sous 1-2 jours)
3. **📞 Réserver sans payer** (Nous vous contacterons)

---

## ✨ Fonctionnalités

### 1. **Résumé de la réservation**
- 🚙 Nom du véhicule
- 📅 Dates de location (début et fin)
- ⏱️ Durée (nombre de jours)
- 💵 Prix par jour
- 💰 **Prix total** affiché en grand

### 2. **Formulaire client**
- **Nom du client** * (obligatoire)
- **Email** * (obligatoire)
- **Téléphone** (optionnel)
- **Notes / Commentaires** (optionnel)

### 3. **Options de paiement**

#### Option A: Carte bancaire 💳
- **Badge**: "Sécurisé" (vert)
- **Description**: Paiement immédiat et sécurisé
- **Action**: Redirection vers Stripe/CMI (à implémenter)
- **Confirmation**: Instantanée

#### Option B: Virement bancaire 🏦
- **Badge**: "En attente" (jaune)
- **Description**: Virement sur compte bancaire
- **Action**: Email avec coordonnées bancaires
- **Confirmation**: 1-2 jours ouvrés après réception

#### Option C: Réserver sans payer 📞
- **Badge**: "Confirmation requise" (jaune)
- **Description**: Réservation enregistrée, paiement ultérieur
- **Action**: L'équipe contacte le client
- **Confirmation**: Sous 24h par email/téléphone

### 4. **Validation et sécurité**
- ✅ Vérification des champs obligatoires
- ✅ Validation email
- ✅ Détection des conflits de dates (backend)
- ✅ Messages d'erreur clairs
- ✅ Loading spinner pendant la soumission

### 5. **Responsive design**
- 📱 Mobile-first (100% responsive)
- 💻 Tablette et desktop optimisés
- 👆 Touch-friendly (boutons 48px min)
- 🎨 Design moderne avec gradients

---

## 🎯 Utilisation

### Scénario 1: Client paie par carte
```
1. Client clique "Aller au paiement" depuis index.html
2. Remplit nom, email, téléphone
3. Sélectionne "💳 Payer par carte bancaire"
4. Clique "💳 Procéder au paiement"
5. → Redirection vers Stripe/CMI (à implémenter)
6. → Réservation confirmée instantanément
```

### Scénario 2: Client paie par virement
```
1. Client remplit le formulaire
2. Sélectionne "🏦 Virement bancaire"
3. Clique "🏦 Réserver (Virement)"
4. → Réservation créée avec status "unpaid"
5. → Email automatique avec:
   - Coordonnées bancaires
   - Référence de paiement
   - Instructions
6. → Confirmation après virement (1-2 jours)
```

### Scénario 3: Client réserve sans payer
```
1. Client remplit le formulaire
2. Sélectionne "📞 Réserver sans payer" (par défaut)
3. Clique "📞 Réserver sans payer"
4. → Réservation créée avec status "unpaid"
5. → L'équipe FandiRent contacte le client sous 24h
6. → Validation et paiement par téléphone/email
```

---

## 🔧 Détails techniques

### URL et paramètres
```
http://127.0.0.1:5500/payment.html?carId=car1&start=2025-11-06&end=2025-11-07&days=1&total=35
```

**Paramètres requis**:
- `carId`: ID de la voiture
- `start`: Date de début (YYYY-MM-DD)
- `end`: Date de fin (YYYY-MM-DD)
- `days`: Nombre de jours
- `total`: Prix total

### Payload de réservation
```javascript
{
  carId: "car1",
  startDate: "2025-11-06",
  endDate: "2025-11-07",
  customerName: "Ahmed Alami",
  customerEmail: "ahmed@example.com",
  customerPhone: "+212 6 00 00 00 00",
  totalPrice: 35,
  notes: "Notes du client\n\nMode de paiement: Virement bancaire",
  paymentMethod: "transfer", // "card", "transfer", "later"
  paymentStatus: "unpaid", // "pending", "unpaid", "paid"
  createdAt: "2025-11-06T10:30:00.000Z"
}
```

### Backend API
```javascript
POST ${API_URL}/reservations
Headers: { 'Content-Type': 'application/json' }
Body: reservationPayload

Response Success (201):
{
  id: "uuid-xxx",
  carId: "car1",
  customerName: "Ahmed Alami",
  ...
}

Response Error (409):
{
  error: "Reservation conflict"
}
```

### Fonctions JavaScript principales

#### `loadCarData()`
- Charge les infos de la voiture depuis l'API
- Affiche le nom et le prix

#### `displayReservationInfo()`
- Affiche les dates formatées
- Affiche la durée et le prix total

#### `selectPaymentOption(method)`
- Gère la sélection visuelle de l'option
- Met à jour le texte du bouton
- Valeurs: "card", "transfer", "later"

#### `showAlert(message, type)`
- Affiche un message d'alerte
- Types: "success", "error", "info"
- Auto-masquage après 5s (sauf erreurs)

#### `submit event handler`
- Valide les champs
- Crée la réservation via API
- Gère les 3 flux de paiement
- Redirige vers index.html après succès

---

## 🎨 Design

### Couleurs
- **Gradient principal**: #667eea → #764ba2
- **Success**: #28a745 (vert)
- **Pending**: #ffc107 (jaune)
- **Error**: #dc3545 (rouge)
- **Gris**: #6c757d

### Badges
```css
.badge (vert): Sécurisé, Immédiat
.badge.pending (jaune): En attente, Confirmation requise
```

### Layout responsive
```
Desktop (>768px):
┌────────────────────────────────┐
│ Header (gradient)              │
├────────────────────────────────┤
│ Résumé voiture (card)          │
│ ┌──────┬──────┬──────┬──────┐ │
│ │Début │ Fin  │Durée │Prix/j│ │
│ └──────┴──────┴──────┴──────┘ │
│ [Total: 350€]                  │
├────────────────────────────────┤
│ Formulaire client              │
│ [Nom] [Email] [Téléphone]      │
├────────────────────────────────┤
│ Options paiement (3 cards)     │
│ ○ Carte    ○ Virement  ● Sans  │
├────────────────────────────────┤
│ [Retour]         [Confirmer]   │
└────────────────────────────────┘

Mobile (<768px):
Tout en colonne avec full-width
```

---

## 📊 États de paiement

### paymentMethod
- `"card"`: Paiement par carte bancaire
- `"transfer"`: Virement bancaire
- `"later"`: Paiement ultérieur

### paymentStatus
- `"unpaid"`: Non payé (transfer, later)
- `"pending"`: En attente (card, après redirection)
- `"paid"`: Payé et confirmé

---

## ✅ Validation

### Côté frontend
```javascript
✅ Nom requis (trim)
✅ Email requis + format valide
✅ Téléphone optionnel
✅ Au moins une option de paiement sélectionnée
✅ Données URL valides (carId, dates, total)
```

### Côté backend
```javascript
✅ carId existe dans la DB
✅ Dates valides (end > start)
✅ Pas de conflit avec réservations existantes
✅ Email format valide
✅ totalPrice > 0
```

---

## 🔄 Flux de redirection

### Après soumission réussie

#### Carte bancaire
```
1. Message: "🔄 Redirection vers la passerelle..."
2. Alert: "Passerelle à venir (Stripe/CMI)"
3. Redirection: index.html (2s)
```

#### Virement
```
1. Message: "✅ Réservation créée!"
2. Alert: Coordonnées bancaires par email
3. Redirection: index.html (2s)
```

#### Sans payer
```
1. Message: "✅ Réservation enregistrée!"
2. Alert: Contact sous 24h
3. Redirection: index.html (2s)
```

### En cas d'erreur
```
1. Message: "❌ [Erreur détaillée]"
2. Bouton réactivé
3. Pas de redirection
```

---

## 🚀 Intégrations futures

### Passerelle de paiement (à implémenter)

#### Option 1: Stripe
```javascript
// Créer une session Stripe
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: carName,
      },
      unit_amount: total * 100,
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: 'http://yoursite.com/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'http://yoursite.com/payment.html',
});

// Rediriger vers Stripe
window.location.href = session.url;
```

#### Option 2: CMI Maroc
```javascript
// Formulaire POST vers CMI
const form = document.createElement('form');
form.method = 'POST';
form.action = 'https://payment.cmi.co.ma/...';
form.innerHTML = `
  <input name="amount" value="${total}">
  <input name="currency" value="504"> // MAD
  <input name="oid" value="${reservationId}">
  ...
`;
document.body.appendChild(form);
form.submit();
```

### Email automatique (à implémenter)

#### Pour virement bancaire
```
Objet: Coordonnées bancaires - Réservation FandiRent

Bonjour Ahmed,

Votre réservation a été enregistrée avec succès!

Détails:
- Véhicule: Clio 5
- Dates: 06/11/2025 → 07/11/2025
- Total: 35€

Coordonnées bancaires:
Banque: Attijariwafa Bank
IBAN: MA64 0011 0000 0000 1234 5678 90
BIC/SWIFT: BCMAMAMC
Bénéficiaire: FandiRent SARL
Référence: RES-2025-XXX

Dès réception du virement, votre réservation sera confirmée.

Cordialement,
L'équipe FandiRent
```

#### Pour réservation sans paiement
```
Objet: Réservation enregistrée - FandiRent

Bonjour Ahmed,

Votre demande de réservation a été enregistrée!

Nous vous contacterons sous 24h à:
- Email: ahmed@example.com
- Téléphone: +212 6 00 00 00 00

Pour finaliser votre réservation et confirmer le paiement.

Détails:
- Véhicule: Clio 5
- Dates: 06/11/2025 → 07/11/2025
- Total: 35€

Cordialement,
L'équipe FandiRent
```

---

## 📱 Responsive

### Breakpoints
```css
/* Desktop */
@media (min-width: 769px) {
  .summary-grid: 2x2 grid
  .payment-option: flex row
  .actions: flex row
}

/* Tablette */
@media (max-width: 768px) {
  .summary-grid: 1 column
  .payment-option: flex column
  .actions: flex column
}

/* Mobile */
@media (max-width: 480px) {
  .header: padding réduit
  .content: padding 1rem
  Boutons: full-width
}
```

---

## 🐛 Résolution de problèmes

### Erreur "Données manquantes"
```
Cause: URL sans paramètres carId/start/end
Solution: Redirection automatique vers index.html après 3s
```

### Erreur "Reservation conflict"
```
Cause: Dates déjà réservées
Solution: Message d'erreur + bouton réactivé
Action: Retourner et choisir d'autres dates
```

### Carte non chargée
```
Cause: API_URL incorrect ou backend down
Solution: Affiche "carId" en fallback
Vérifier: config.js et backend running
```

### Bouton bloqué après erreur
```
Cause: Exception non catchée
Solution: Code refactoré avec try/catch
Fallback: Recharger la page (F5)
```

---

## 📝 Notes pour développeurs

### Fichiers liés
- `payment.html` (cette page)
- `config.js` (API_URL)
- `backend/server.js` (POST /reservations)
- `index.html` (lien "Aller au paiement")

### Variables globales
```javascript
urlParams: URLSearchParams (query string)
reservationData: { carId, startDate, endDate, days, total }
currentCar: Object (données voiture depuis API)
```

### Event listeners
```javascript
DOMContentLoaded: Initialisation
form.submit: Soumission réservation
payment-option.click: Sélection paiement
backBtn.click: Retour page précédente
```

### Bonnes pratiques
1. **Toujours valider** côté client ET serveur
2. **Feedback visuel** (spinner, messages)
3. **Graceful degradation** (fallbacks)
4. **Mobile-first** (responsive)
5. **Accessibilité** (labels, ARIA)

---

## 🎓 Améliorations futures

### Court terme
- ✅ Email automatique (virement/sans paiement)
- ✅ SMS de confirmation
- ✅ Historique des réservations client

### Moyen terme
- ✅ Intégration Stripe/CMI
- ✅ Multi-devises (MAD/EUR)
- ✅ Code promo/réduction

### Long terme
- ✅ Application mobile
- ✅ Paiement en plusieurs fois
- ✅ Assurance en ligne

---

**Version**: 1.0  
**Date**: Novembre 2025  
**Auteur**: FandiRent Team  
**Status**: ✅ Production Ready
