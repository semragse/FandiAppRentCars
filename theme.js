// theme.js
// Système de thème Dark/Light pour l'application FandiApp
// Utilise localStorage pour persister le choix utilisateur
// Applique automatiquement le thème sauvegardé au chargement de la page

/**
 * Clé localStorage pour sauvegarder le thème sélectionné
 * Valeurs possibles: 'light' ou 'dark'
 */
const THEME_KEY = 'fandi-theme';

/**
 * Thème par défaut si aucune préférence n'est sauvegardée
 */
const DEFAULT_THEME = 'light';

/**
 * Récupère le thème actuel depuis localStorage
 * @returns {string} 'light' ou 'dark'
 */
function getCurrentTheme() {
  return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
}

/**
 * Applique le thème à la page en ajoutant/retirant la classe 'dark-theme' sur <body>
 * @param {string} theme - 'light' ou 'dark'
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  
  // Mettre à jour l'icône du bouton si elle existe
  updateThemeIcon(theme);
  
  console.log(`🎨 Thème appliqué: ${theme}`);
}

/**
 * Sauvegarde le thème dans localStorage
 * @param {string} theme - 'light' ou 'dark'
 */
function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  console.log(`💾 Thème sauvegardé: ${theme}`);
}

/**
 * Bascule entre les thèmes light et dark
 */
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  applyTheme(newTheme);
  saveTheme(newTheme);
  
  // Animation de rotation pour le bouton
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
      toggleBtn.style.transform = 'rotate(0deg)';
    }, 300);
  }
}

/**
 * Met à jour l'icône du bouton selon le thème actuel
 * @param {string} theme - 'light' ou 'dark'
 */
function updateThemeIcon(theme) {
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  
  if (!sunIcon || !moonIcon) return;
  
  if (theme === 'dark') {
    // En mode dark, afficher le soleil (pour basculer vers light)
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    // En mode light, afficher la lune (pour basculer vers dark)
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
}

/**
 * Initialise le thème au chargement de la page
 * Cette fonction doit être appelée dès que possible pour éviter le flash
 */
function initTheme() {
  const savedTheme = getCurrentTheme();
  applyTheme(savedTheme);
  console.log(`🚀 Initialisation du thème: ${savedTheme}`);
}

// Appliquer le thème immédiatement au chargement du script (avant le DOM)
// Cela évite le "flash" de thème incorrect
initTheme();

// Réinitialiser au cas où le DOM ne serait pas prêt
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Attacher l'événement au bouton toggle
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
});

// Export global pour utilisation dans les pages
window.toggleTheme = toggleTheme;
window.getCurrentTheme = getCurrentTheme;
window.initTheme = initTheme;
