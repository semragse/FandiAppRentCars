# 🚀 Comment Démarrer FandiRent

## ⚡ Méthode Rapide (Recommandée)

### Option 1: Double-cliquer sur le fichier BAT
```
Double-cliquez sur: start.bat
```
✅ Lance automatiquement le backend  
✅ Ouvre l'admin dans votre navigateur  
✅ Tout est prêt en 3 secondes  

### Option 2: Exécuter le script PowerShell
```
Double-cliquez sur: start.ps1
```
ou dans PowerShell:
```powershell
.\start.ps1
```

---

## 📋 Ce que fait le script

1. **Démarre le serveur backend** sur `http://localhost:3001`
2. **Attend 3 secondes** que le serveur soit prêt
3. **Ouvre automatiquement** `admin.html` dans votre navigateur

---

## 🛠️ Méthode Manuelle (si besoin)

Si vous préférez démarrer manuellement:

### 1. Démarrer le Backend
```powershell
cd backend
npm start
```

### 2. Ouvrir le Frontend
- Ouvrez `admin.html` dans votre navigateur
- ou `index.html` pour la page principale

---

## 🔄 Auto-démarrage avec VS Code (Alternative)

Pour que le backend démarre automatiquement quand vous ouvrez le projet:

1. Créez `.vscode/tasks.json` (déjà fait)
2. Appuyez sur `Ctrl+Shift+B` dans VS Code
3. Sélectionnez "Start Backend Server"

---

## 🎯 Vérifier que tout fonctionne

### Backend:
- Ouvrez: http://localhost:3001/health
- Vous devriez voir: `{"status":"ok","timestamp":"..."}`

### Frontend:
- Ouvrez: http://127.0.0.1:5500/admin.html
- Vous devriez voir les cartes de voitures

---

## 🐛 Dépannage

### Le backend ne démarre pas
```powershell
cd backend
npm install
npm start
```

### Port 3001 déjà utilisé
```powershell
# Arrêter le processus sur le port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

### Port 5500 déjà utilisé
- Changez le port du Live Server dans VS Code
- Ou utilisez un autre serveur web

---

## 📌 Raccourci Bureau (Optionnel)

Pour créer un raccourci sur votre bureau:

1. **Clic droit** sur `start.bat`
2. **Envoyer vers** → **Bureau (créer un raccourci)**
3. Renommez en "FandiRent"
4. Double-cliquez pour lancer l'app!

---

## 🎨 Fichiers Créés

- `start.bat` - Script de démarrage Windows (double-clic)
- `start.ps1` - Script PowerShell avec couleurs
- `.vscode/tasks.json` - Tâche VS Code pour le backend

---

**Astuce:** Gardez la fenêtre du backend ouverte pendant que vous travaillez. Fermez-la quand vous avez fini.
