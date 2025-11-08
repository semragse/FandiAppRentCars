# 🚀 Guide de Déploiement Railway avec PostgreSQL

## Étape 1: Créer le projet Railway

1. Allez sur [railway.app](https://railway.app)
2. Connectez-vous avec GitHub
3. Cliquez sur **"New Project"**
4. Sélectionnez **"Deploy from GitHub repo"**
5. Choisissez `semragse/FandiAppRentCars`

## Étape 2: Ajouter PostgreSQL

1. Dans votre projet Railway, cliquez sur **"+ New"**
2. Sélectionnez **"Database"**
3. Choisissez **"Add PostgreSQL"**
4. Railway va automatiquement créer la base de données

## Étape 3: Connecter l'application à la base de données

Railway va automatiquement ajouter la variable `DATABASE_URL` à votre application.
L'application détectera automatiquement PostgreSQL et l'utilisera.

## Étape 4: Ajouter les variables d'environnement

Dans l'onglet **"Variables"** de votre service (pas la base de données):

```env
NODE_ENV=production
STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
```

📝 **Récupérez vos clés Stripe depuis votre fichier `.env` local**

⚠️ **Important**: Ne touchez PAS à la variable `DATABASE_URL` - Railway la gère automatiquement.

## Étape 5: Déployer

1. Railway va automatiquement déployer votre application
2. Attendez que le déploiement soit terminé (regardez les logs)
3. L'application va automatiquement:
   - Se connecter à PostgreSQL
   - Créer les tables
   - Insérer les données initiales

## Étape 6: Obtenir l'URL publique

1. Dans votre service, allez dans **"Settings"**
2. Section **"Networking"**
3. Cliquez sur **"Generate Domain"**
4. Vous obtiendrez une URL: `https://votre-app.up.railway.app`

## Étape 7: Tester l'application

Testez ces URLs:
- `https://votre-app.up.railway.app/` → Page d'accueil
- `https://votre-app.up.railway.app/health` → Health check
- `https://votre-app.up.railway.app/cars` → API des voitures
- `https://votre-app.up.railway.app/admin.html` → Panel admin

## 🔍 Vérification des logs

Si quelque chose ne fonctionne pas:
1. Cliquez sur votre service
2. Allez dans l'onglet **"Deployments"**
3. Cliquez sur le dernier déploiement
4. Regardez les **"Build Logs"** et **"Deploy Logs"**

Vous devriez voir:
```
✅ Stripe initialized successfully
🐘 Using PostgreSQL database
✅ 10 réservations de test créées
✅ API running on http://0.0.0.0:3001
```

## 📊 Accéder à la base de données

Pour voir vos données PostgreSQL:
1. Cliquez sur le service **PostgreSQL**
2. Onglet **"Data"** pour voir les tables
3. Onglet **"Connect"** pour obtenir les credentials

## 🔄 Redéploiement

Chaque fois que vous faites `git push`, Railway redéploiera automatiquement!

```bash
git add .
git commit -m "Votre message"
git push
```

## 🆘 Problèmes courants

### Application failed to respond
- ✅ **Résolu**: Serveur écoute maintenant sur `0.0.0.0`

### SQLite3 binding error
- ✅ **Résolu**: SQLite3 est optionnel, PostgreSQL est utilisé en production

### Module not found errors
- ✅ **Résolu**: Toutes les dépendances sont dans package.json
- Railway installe automatiquement `pg` et `pg-hstore`

### Variables d'environnement manquantes
- Vérifiez que `STRIPE_SECRET_KEY` est bien ajouté dans Variables
- Railway génère automatiquement `DATABASE_URL` quand vous ajoutez PostgreSQL

### Base de données vide
- L'application seed automatiquement au démarrage si vide
- Les données de test sont créées automatiquement

### Connection timeout to database
- Assurez-vous que PostgreSQL est bien créé dans le même projet
- Railway connecte automatiquement via `DATABASE_URL`

## 🎉 C'est fait!

Votre application est maintenant en production sur Railway avec PostgreSQL!

---

**Coût**: Gratuit jusqu'à 5$ de crédit par mois (largement suffisant pour ce projet)
