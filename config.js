// Configuration de l'environnement
const CONFIG = {
    // Détecte automatiquement l'environnement
    isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // URL de l'API selon l'environnement
    getApiUrl() {
        // Si on est en développement local
        if (this.isDevelopment) {
            return 'http://localhost:3001';
        }
        
        // Si on est en production (tunnel ou déploiement)
        // Cherche l'URL de l'API dans localStorage ou utilise une valeur par défaut
        const savedApiUrl = localStorage.getItem('FANDIRENT_API_URL');
        if (savedApiUrl) {
            return savedApiUrl;
        }
        
        // Par défaut, essaye l'API sur le même domaine au port 3001
        return `${window.location.protocol}//${window.location.hostname}:3001`;
    },
    
    // Sauvegarder une nouvelle URL d'API
    setApiUrl(url) {
        localStorage.setItem('FANDIRENT_API_URL', url);
        console.log('✅ API URL updated:', url);
    }
};

// Export pour utilisation dans d'autres fichiers
window.FandiConfig = CONFIG;

// Export API_URL pour compatibilité avec les pages existantes
window.API_URL = CONFIG.getApiUrl();

// Afficher la configuration au chargement
console.log('🔧 FandiRent Config:', {
    environment: CONFIG.isDevelopment ? 'Development' : 'Production',
    apiUrl: CONFIG.getApiUrl()
});
