import CONFIG from './config.js';

class Provider {
    static async fetchData() {
        try {
            const response = await fetch('data/characters.json');
            const data = await response.json();
            
            // Adaptation à la structure réelle des données
            let champions = [];
            for (let role in data) {
                champions = champions.concat(data[role]);
            }
            
            return champions;
        } catch (error) {
            console.error('Erreur lors du chargement des données', error);
            return [];
        }
    }
}
export default Provider;