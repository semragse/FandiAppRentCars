# 🚀 Guide de Déploiement Netlify + Neon PostgreSQL

Ce guide vous explique comment déployer FandiRent sur **Netlify** avec une base de données **Neon PostgreSQL**.

---

## 📋 Prérequis

- ✅ Compte GitHub (votre code est déjà sur https://github.com/semragse/FandiAppRentCars)
- ✅ Compte Netlify (gratuit) - https://app.netlify.com
- ✅ Compte Neon (gratuit) - https://neon.tech

---

## 🎯 Architecture

```
┌─────────────────┐
│   Netlify       │  ← Frontend (HTML/CSS/JS)
│   + Functions   │  ← Backend API (Serverless)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Neon Database  │  ← PostgreSQL
└─────────────────┘
```

---

## 📦 ÉTAPE 1: Créer une Base de Données Neon

### 1.1. Inscrivez-vous sur Neon
1. Allez sur https://neon.tech
2. Cliquez sur **"Sign Up"** ou **"Get Started"**
3. Connectez-vous avec GitHub (recommandé)

### 1.2. Créez un Projet
1. Une fois connecté, cliquez sur **"Create Project"**
2. Remplissez les informations:
   - **Project Name**: `FandiRent`
   - **Database Name**: `fandicars`
   - **Region**: Choisissez le plus proche (Europe: Frankfurt)
3. Cliquez sur **"Create Project"**

### 1.3. Récupérez la Connection String
1. Dans votre projet Neon, allez dans **"Dashboard"**
2. Cherchez **"Connection string"**
3. Copiez la chaîne qui ressemble à:
   ```
   postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/fandicars?sslmode=require
   ```
4. **GARDEZ-LA PRÉCIEUSEMENT** - vous en aurez besoin pour Netlify

---

## 🌐 ÉTAPE 2: Déployer sur Netlify

### 2.1. Connectez votre Dépôt GitHub

1. Allez sur https://app.netlify.com
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Choisissez **"GitHub"**
4. Autorisez Netlify à accéder à vos repos
5. Sélectionnez **`FandiAppRentCars`**

### 2.2. Configurez le Build

Sur la page de configuration:

**Build settings:**
- **Branch to deploy**: `main` (ou `master`)
- **Build command**: `npm run build`
- **Publish directory**: `.` (point)
- **Functions directory**: `netlify/functions`

### 2.3. Ajoutez les Variables d'Environnement

Avant de déployer, cliquez sur **"Show advanced"** puis **"New variable"**:

Ajoutez ces variables:

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `postgresql://...` (copié depuis Neon) |
| `STRIPE_PUBLIC_KEY` | `pk_test_...` (votre clé publique Stripe depuis .env) |
| `STRIPE_SECRET_KEY` | `sk_test_...` (votre clé secrète Stripe depuis .env) |
| `NODE_ENV` | `production` |

### 2.4. Déployez!

1. Cliquez sur **"Deploy site"**
2. Attendez 2-3 minutes
3. Netlify va:
   - ✅ Cloner votre code
   - ✅ Installer les dépendances
   - ✅ Construire votre site
   - ✅ Déployer les Functions

---

## ✅ ÉTAPE 3: Vérification

### 3.1. Vérifiez le Déploiement

1. Une fois le déploiement terminé, cliquez sur votre site
2. Vous verrez une URL comme: `https://your-site-name.netlify.app`

### 3.2. Testez les Endpoints

Ouvrez ces URLs dans votre navigateur:

```
https://your-site-name.netlify.app/
https://your-site-name.netlify.app/api/health
https://your-site-name.netlify.app/api/cars
```

Vous devriez voir:
- ✅ Page d'accueil du site
- ✅ `{"status": "ok", "database": "Neon PostgreSQL"}`
- ✅ Liste des voitures (peut être vide au début)

### 3.3. Initialisez les Données

Pour ajouter les voitures de test, vous devez exécuter le seed **une seule fois**:

**Option A: Via Netlify CLI (local)**
```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Lier le projet
netlify link

# Exécuter le seed avec DATABASE_URL de Neon
DATABASE_URL="postgresql://..." node backend/seed.js
```

**Option B: Manuellement via Neon Console**
1. Allez dans Neon Dashboard → **SQL Editor**
2. Connectez-vous à votre base `fandicars`
3. Créez les tables et données manuellement

---

## 🔧 Configuration du Domaine Personnalisé (Optionnel)

### 4.1. Domaine Netlify Gratuit

Par défaut, vous avez: `https://random-name-123.netlify.app`

Pour le personnaliser:
1. Dans Netlify, allez dans **"Site settings"** → **"Domain management"**
2. Cliquez sur **"Options"** → **"Edit site name"**
3. Changez en: `fandirent` → `https://fandirent.netlify.app`

### 4.2. Domaine Personnalisé (Payant)

Si vous avez acheté `fandirent.com`:
1. Dans Netlify, allez dans **"Domain management"**
2. Cliquez sur **"Add custom domain"**
3. Suivez les instructions pour configurer les DNS

---

## 📊 Monitoring et Logs

### Voir les Logs

1. Allez dans votre site Netlify
2. Cliquez sur **"Functions"**
3. Cliquez sur **"api"**
4. Vous verrez tous les logs de votre backend

### Métriques Neon

1. Allez dans Neon Dashboard
2. Onglet **"Monitoring"**
3. Vous verrez:
   - Nombre de connexions
   - Requêtes par seconde
   - Utilisation du stockage

---

## 🐛 Dépannage

### Erreur: "Function failed to load"

**Cause:** Dépendances manquantes ou erreur de syntaxe

**Solution:**
1. Vérifiez les logs dans Netlify Functions
2. Assurez-vous que `serverless-http` est installé
3. Re-déployez

### Erreur: "Database connection failed"

**Cause:** `DATABASE_URL` incorrecte ou Neon inactif

**Solution:**
1. Vérifiez que `DATABASE_URL` est correctement configurée dans Netlify
2. Testez la connexion depuis Neon SQL Editor
3. Vérifiez que le projet Neon n'est pas en pause (free tier)

### Erreur: "Function timeout"

**Cause:** Requête trop longue (limite 10s sur free tier)

**Solution:**
1. Optimisez vos requêtes SQL
2. Ajoutez des index dans Neon
3. Upgradez Netlify si nécessaire

### Site charge mais API ne répond pas

**Cause:** Redirections incorrectes

**Solution:**
1. Vérifiez `netlify.toml`
2. Assurez-vous que les redirects `/api/*` pointent vers `/.netlify/functions/api/:splat`

---

## 🚀 Mises à Jour Futures

### Pour mettre à jour votre site:

```bash
# 1. Faites vos modifications localement
git add .
git commit -m "Description des changements"
git push

# 2. Netlify redéploie automatiquement!
```

C'est tout! Netlify détecte automatiquement les pushs GitHub et redéploie.

---

## 💰 Coûts

### Netlify (Free Tier):
- ✅ 300 build minutes/mois
- ✅ 100 GB bandwidth/mois
- ✅ 125k function invocations/mois
- ✅ Suffisant pour commencer!

### Neon (Free Tier):
- ✅ 0.5 GB stockage
- ✅ 10 branches (dev, staging, prod)
- ✅ Pause automatique après 5 min d'inactivité
- ✅ Parfait pour les tests!

---

## 📞 Besoin d'Aide?

- **Netlify Docs**: https://docs.netlify.com
- **Neon Docs**: https://neon.tech/docs
- **Problème avec le code**: Ouvrez une issue sur GitHub

---

## 🎉 Félicitations!

Votre application FandiRent est maintenant **en production** avec:
- ✅ Frontend rapide sur Netlify CDN
- ✅ Backend serverless scalable
- ✅ Base de données PostgreSQL moderne
- ✅ SSL automatique (HTTPS)
- ✅ Déploiement continu depuis GitHub

**URL de production**: `https://votre-site.netlify.app`

Bon business! 🚗💨
