import Provider from "../provider.js";

const Favoris = {
    async render() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const champions = await Provider.fetchChampions();
        const favoriteChampions = champions.filter(champ => favorites.includes(champ.id));

        return `
            <h2>Vos champions favoris</h2>
            <div class="favorites-grid">
                ${favoriteChampions.map(champ => `
                    <div class="favorite-card">
                        <img src="app/images/${champ.image}" alt="${champ.name}">
                        <h3>${champ.name}</h3>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

export default Favoris;