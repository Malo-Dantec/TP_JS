import CONFIG from './config.js';

class Provider {
    static async fetchData(endpoint) {
        try {
            const response = await fetch(`${CONFIG.ENDPOINT}/${endpoint}`);
            const data = await response.json();

            // Adaptation à la structure réelle des données
            let champions = [];
            for (let role in data.champions) {
                champions = champions.concat(data.champions[role]);
            }

            return endpoint === 'items' ? data.items : champions;
        } catch (error) {
            console.error('Erreur lors du chargement des données', error);
            return [];
        }
    }
}
export default Provider;
