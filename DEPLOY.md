# 🚗 FandiAuto - Location de Voitures

Application de location de voitures avec gestion des réservations et paiements.

## 🚀 Déploiement sur Railway

### Prérequis
- Compte GitHub (déjà fait ✅)
- Compte Railway.app (gratuit)

### Étapes de déploiement

1. **Créer un compte Railway**
   - Allez sur [railway.app](https://railway.app)
   - Connectez-vous avec votre compte GitHub

2. **Créer un nouveau projet**
   - Cliquez sur "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez `semragse/FandiAppRentCars`

3. **Configuration automatique**
   Railway détectera automatiquement:
   - ✅ Node.js
   - ✅ `package.json`
   - ✅ Script de démarrage (`npm start`)

4. **Variables d'environnement** (Optionnel)
   Dans l'onglet "Variables", ajoutez:
   ```
   PORT=3001
   NODE_ENV=production
   STRIPE_PUBLIC_KEY=pk_test_votre_cle
   STRIPE_SECRET_KEY=sk_test_votre_cle
   ```

5. **Déploiement**
   - Railway déploiera automatiquement
   - Vous obtiendrez une URL publique: `https://votre-app.railway.app`

6. **Domaine personnalisé** (Optionnel)
   - Dans "Settings" → "Domains"
   - Ajoutez votre domaine personnalisé

### 📝 Post-déploiement

1. **Initialiser la base de données**
   Une fois déployé, exécutez le seed:
   ```bash
   railway run npm run seed
   ```

2. **Tester l'API**
   ```
   https://votre-app.railway.app/health
   https://votre-app.railway.app/cars
   ```

## 🛠️ Développement local

```bash
# Installation
npm install

# Démarrer le serveur
npm start

# Initialiser la base de données
npm run seed
```

## 📦 Structure du projet

```
FandiApp/
├── server.js              # Serveur Express principal
├── package.json           # Dépendances Node.js
├── Procfile              # Configuration Railway
├── railway.toml          # Configuration Railway avancée
├── backend/
│   ├── models/           # Modèles Sequelize
│   ├── config/           # Configuration (Stripe, etc.)
│   └── seed.js           # Script d'initialisation DB
├── pages/                # Pages HTML
└── js/                   # Scripts frontend
```

## 🔧 Technologies

- **Backend**: Node.js, Express.js
- **Base de données**: SQLite (Sequelize ORM)
- **Paiements**: Stripe
- **Déploiement**: Railway.app

## 📞 Support

Pour toute question, contactez: votre-email@example.com

---
Made with ❤️ by FandiAuto
