import CONFIG from './config.js';

class Provider {
    static async fetchChampions() {
        try {
            const response = await fetch(`${CONFIG.ENDPOINT}/champions`);
            return await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des champions', error);
            return [];
        }
    }

    static async fetchChampion(id) {
        try {
            const response = await fetch(`${CONFIG.ENDPOINT}/champions/${id}`);
            if (!response.ok) throw new Error('HTTP error ' + response.status);
            return await response.json();
        } catch (error) {
            console.error('Erreur fetchChampion:', error);
            return null;
        }
    }
    
    static async saveChampionRating(championId, rating) {
        const ratings = JSON.parse(localStorage.getItem('championRatings') || '{}');
        ratings[championId] = rating;
        localStorage.setItem('championRatings', JSON.stringify(ratings));
        return ratings;
    }
    
    static async getChampionRating(championId) {
        const ratings = JSON.parse(localStorage.getItem('championRatings') || '{}');
        return ratings[championId] || 0;
    }
    
    static async updateChampionItems(id, items) {
        try {
            const response = await fetch(`${CONFIG.ENDPOINT}/champions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items })
            });
            return await response.json();
        } catch (error) {
            console.error('Erreur updateChampionItems:', error);
            return null;
        }
    }

    static async fetchItems() {
        try {
            const response = await fetch(`${CONFIG.ENDPOINT}/items`);
            return await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des items', error);
            return [];
        }
    }

    static async updateChampion(id, data) {
        try {
            // Récupérer d'abord les données existantes
            const champion = await this.fetchChampion(id);
            if (!champion) return null;
    
            // Fusionner les modifications avec les données existantes
            const updatedData = { ...champion, ...data };
    
            const response = await fetch(`${CONFIG.ENDPOINT}/champions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData) // Envoyer l'objet complet
            });
            return await response.json();
        } catch (error) {
            console.error('Erreur mise à jour champion', error);
        }
    }
    
    static async toggleItemFavorite(championId, itemId) {
        const favorites = JSON.parse(localStorage.getItem('itemFavorites')) || {};
        if (!favorites[championId]) favorites[championId] = [];
        
        const index = favorites[championId].indexOf(itemId);
        if (index > -1) {
            favorites[championId].splice(index, 1);
        } else {
            favorites[championId].push(itemId);
        }
        localStorage.setItem('itemFavorites', JSON.stringify(favorites));
        return favorites;
    }

    static async manageItemKits(kitData = null, action = 'get') {
        const kits = JSON.parse(localStorage.getItem('itemKits')) || {};
        
        switch(action) {
            case 'save':
                if (!kitData.name || kitData.items.length === 0) return;
                const kitId = Date.now().toString();
                kits[kitId] = {
                    ...kitData,
                    id: kitId,
                    timestamp: new Date().toISOString()
                };
                break;
                
            case 'update':
                if (kits[kitData.id]) {
                    kits[kitData.id] = { ...kits[kitData.id], ...kitData };
                }
                break;
                
            case 'delete':
                delete kits[kitData.id];
                break;
        }
        
        localStorage.setItem('itemKits', JSON.stringify(kits));
        return Object.values(kits);
    }
    
    static async getChampionKits(championId) {
        const kits = JSON.parse(localStorage.getItem('itemKits')) || {};
        return Object.values(kits).filter(kit => kit.championId === championId);
    }
}

export default Provider;