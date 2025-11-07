/**
 * Contact Information Manager
 * Charge et met à jour dynamiquement les informations de contact sur toutes les pages
 */

(function() {
    'use strict';
    
    // Configuration
    const API_URL = window.FandiConfig ? window.FandiConfig.getApiUrl() : 'http://localhost:3001';
    
    // Cache des informations de contact
    let contactInfo = {
        phone: '+213 771 39 14 80',
        email: 'contact@fandiauto.com',
        address: 'Tlemcen, Algérie',
        company_name: 'FANDIAUTO',
        whatsapp_number: '212676543456'
    };
    
    /**
     * Charge les informations de contact depuis l'API
     */
    async function loadContactInfo() {
        try {
            const response = await fetch(`${API_URL}/settings`);
            if (!response.ok) {
                throw new Error('Failed to fetch contact info');
            }
            
            const settings = await response.json();
            
            // Mettre à jour le cache
            if (settings.contact_phone) contactInfo.phone = settings.contact_phone;
            if (settings.contact_email) contactInfo.email = settings.contact_email;
            if (settings.contact_address) contactInfo.address = settings.contact_address;
            if (settings.company_name) contactInfo.company_name = settings.company_name;
            if (settings.whatsapp_number) contactInfo.whatsapp_number = settings.whatsapp_number;
            
            console.log('✅ Contact information loaded:', contactInfo);
            
            // Mettre à jour l'affichage
            updateContactDisplay();
            
            return contactInfo;
        } catch (error) {
            console.error('❌ Error loading contact info:', error);
            // Utiliser les valeurs par défaut
            updateContactDisplay();
            return contactInfo;
        }
    }
    
    /**
     * Met à jour tous les éléments d'affichage des informations de contact
     */
    function updateContactDisplay() {
        // Mettre à jour les numéros de téléphone
        document.querySelectorAll('[data-contact="phone"]').forEach(el => {
            el.textContent = contactInfo.phone;
            if (el.tagName === 'A') {
                el.href = `tel:${contactInfo.phone.replace(/\s/g, '')}`;
            }
        });
        
        // Mettre à jour les emails
        document.querySelectorAll('[data-contact="email"]').forEach(el => {
            el.textContent = contactInfo.email;
            if (el.tagName === 'A') {
                el.href = `mailto:${contactInfo.email}`;
            }
        });
        
        // Mettre à jour les adresses
        document.querySelectorAll('[data-contact="address"]').forEach(el => {
            el.textContent = contactInfo.address;
        });
        
        // Mettre à jour le nom de l'entreprise
        document.querySelectorAll('[data-contact="company"]').forEach(el => {
            el.textContent = contactInfo.company_name;
        });
        
        // Mettre à jour le lien WhatsApp
        document.querySelectorAll('[data-contact="whatsapp"]').forEach(el => {
            if (el.tagName === 'A') {
                const whatsappNumber = contactInfo.whatsapp_number || contactInfo.phone.replace(/\s/g, '');
                el.href = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;
            }
        });
        
        console.log('✅ Contact display updated');
    }
    
    /**
     * Retourne les informations de contact actuelles
     */
    function getContactInfo() {
        return { ...contactInfo };
    }
    
    /**
     * Force le rechargement des informations de contact
     */
    async function refreshContactInfo() {
        return await loadContactInfo();
    }
    
    // Exposer l'API globalement
    window.ContactInfoManager = {
        load: loadContactInfo,
        get: getContactInfo,
        refresh: refreshContactInfo,
        update: updateContactDisplay
    };
    
    // Charger automatiquement au chargement de la page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContactInfo);
    } else {
        loadContactInfo();
    }
})();
