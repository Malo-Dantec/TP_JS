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
    
    static async updateChampionItems(id, items) {
        try {
            const champion = await this.fetchChampion(id);
            if (!champion) return null;
    
            const updated = { ...champion, items };
            const response = await fetch(`${CONFIG.ENDPOINT}/champions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
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
            const response = await fetch(`${CONFIG.ENDPOINT}/champions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
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
    }
}

export default Provider;