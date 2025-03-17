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
            return await response.json();
        } catch (error) {
            console.error('Champion non trouvé', error);
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
}

export default Provider;