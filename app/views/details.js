import Provider from "../provider.js";
import { updateStatsDisplay } from "../utils/helpers.js";

const Details = {
    async render() {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const id = params.get('id');
        
        if (!id) return '<div class="error">Aucun champion sélectionné</div>';

        try {
            const [champion, items] = await Promise.all([
                Provider.fetchChampion(id),
                Provider.fetchItems()
            ]);

            if (!champion) return '<div class="error">Champion introuvable</div>';

            const favorites = JSON.parse(localStorage.getItem('itemFavorites')) || {};

            return `
                <div class="champion-detail">
                    <a href="#listing" class="back-button">← Retour</a>
                    
                    <div class="champion-header">
                        <img src="app/images/champions/${champion.image}" 
                            alt="${champion.name}" 
                            class="champion-image"
                            loading="lazy">
                        
                        <div class="champion-info">
                            <h1>
                                ${champion.name}
                                <button class="favorite-detail" data-id="${champion.id}">
                                    ${(JSON.parse(localStorage.getItem('favorites') || []).includes(champion.id) ? '★' : '☆')}
                                </button>
                            </h1>
                            <div class="champion-meta">
                                <span class="role">${champion.role}</span>
                                <span class="type">${champion.type.join(', ')}</span>
                            </div>
                            
                            <div class="stats-container">
                                ${updateStatsDisplay(champion.stats)}
                            </div>
                        </div>
                    </div>

                    <div class="item-management">
                        <div class="current-build">
                            <h3>Build actuelle (${champion.items.length}/6)</h3>
                            <div class="items-grid">
                                ${champion.items.map(itemId => {
                                    const item = items.find(i => i.id === itemId);
                                    return item ? `
                                        <div class="item-card" data-id="${item.id}">
                                            <div class="item-name">${item.nom}</div>
                                            <button class="remove-item">×</button>
                                        </div>
                                    ` : '';
                                }).join('')}
                            </div>
                        </div>

                        <div class="add-item-section">
                            <select class="item-select">
                                ${items.filter(i => !champion.items.includes(i.id))
                                .map(i => `
                                    <option value="${i.id}" 
                                            ${(favorites[champion.id] || []).includes(i.id) ? 'data-favorite' : ''}>
                                        ${i.nom} ${(favorites[champion.id] || []).includes(i.id) ? '★' : ''}
                                    </option>
                                `).join('')}
                            </select>
                            
                            <button class="toggle-favorite-item">
                                ${items.find(i => i.id === parseInt(document.querySelector('.item-select')?.value))?.isFavorite ? '★' : '☆'}
                            </button>
                            
                            <button class="add-item-button">Ajouter l'item</button>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(error);
            return '<div class="error">Erreur de chargement des détails</div>';
        }
    }
};

export default Details;