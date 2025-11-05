# Calcul Prix avec Majoration Weekend - Clio 5

## Ce qui a été implémenté

### 1. Fichier `clio5Pricing.js`
- Contient la logique de calcul du prix pour la Clio 5
- Tarif de base: 35€/jour
- Majoration weekend: +20% sur samedi et dimanche
- Fonction `calculateClio5PriceForUI(startDate, endDate)` exportée globalement

### 2. Modifications dans `index.html`
- Import du script `clio5Pricing.js` avant `</body>`
- Modification de la fonction `updateQuickPrice()` pour utiliser le calcul weekend pour la Clio 5 (car1)
- Modification du bouton de paiement pour utiliser le même calcul
- Les autres voitures continuent d'utiliser les remises dégressives classiques

### 3. Page de test `test-clio5.html`
- Interface simple pour tester le calcul
- Affiche le détail jour par jour avec indication des weekends
- Exemple pré-rempli: samedi 8 nov au lundi 10 nov 2025

## Comment tester

### Test rapide
Ouvrez `test-clio5.html` dans votre navigateur:
- Vous verrez le calcul pour samedi-dimanche (2 jours)
- Prix attendu: **84€** (42€ samedi + 42€ dimanche)

### Test dans l'interface principale
1. Ouvrez `index.html`
2. Cliquez sur "Réserver" pour la **Clio 5** uniquement
3. Sélectionnez des dates incluant samedi/dimanche:
   - Exemple: du 08/11/2025 au 10/11/2025
   - Le prix affiché devrait être: **84€ (2j, dont 14€ weekend)**
4. Les autres voitures (Audi, Mercedes, etc.) continuent avec l'ancien système

## Calcul détaillé - Exemple

**Période:** Samedi 8 nov au Lundi 10 nov (2 jours)
- Samedi 8: 35€ + 20% = **42€**
- Dimanche 9: 35€ + 20% = **42€**
- **Total: 84€**

**Période:** Vendredi 7 nov au Lundi 10 nov (3 jours)
- Vendredi 7: **35€**
- Samedi 8: 35€ + 20% = **42€**
- Dimanche 9: 35€ + 20% = **42€**
- **Total: 119€**

## Prochaines étapes suggérées

1. ✅ **Testé:** Calcul weekend pour Clio 5
2. 🔄 **À faire:** Étendre à toutes les voitures si satisfait
3. 🔄 **À faire:** Ajouter haute saison (juillet-août +20%)
4. 🔄 **À faire:** Combiner weekend + haute saison
5. 🔄 **À faire:** Intégrer dans le backend (endpoint `/calculate-price`)

## Structure du code

```
FandiApp.1/
├── clio5Pricing.js        # Logique de calcul (frontend)
├── test-clio5.html        # Page de test isolée
├── index.html             # Intégration dans l'UI principale
└── backend/
    └── pricingClio5.js    # Logique identique côté serveur
```

## Notes techniques

- Le calcul est fait en JavaScript pur (pas de dépendances)
- Compatible avec tous les navigateurs modernes
- Le weekend est détecté via `date.getDay()` (0=dimanche, 6=samedi)
- Les dates sont au format ISO (YYYY-MM-DD)

---
✅ **Prêt à tester !** Ouvrez `test-clio5.html` ou testez la Clio 5 dans `index.html`
