import Provider from "../provider.js";
import { updateStatsDisplay } from "../utils/helpers.js";

const Details = {
    async render() {
        const id = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
        const champion = await Provider.fetchChampion(id);
        if (!champion) return '<div class="error">Champion non trouvé</div>';

        const items = await Provider.fetchItems();
        const favorites = JSON.parse(localStorage.getItem('itemFavorites')) || {};

        return `
            <div class="champion-detail">
                <div class="header">
                    <img src="app/images/${champion.image}" alt="${champion.name}">
                    <div class="info">
                        <h1>${champion.name}</h1>
                        <div class="rating">
                            ${[1,2,3,4,5].map(i => `
                                <span class="star ${i <= champion.rating ? 'filled' : ''}" 
                                      data-rating="${i}">★</span>
                            `).join('')}
                        </div>
                        <div class="stats">
                            ${updateStatsDisplay(champion.stats)}
                        </div>
                    </div>
                </div>
                
                <div class="item-management">
                    <div class="current-items">
                        <h3>Équipement (${champion.items.length}/6)</h3>
                        <div class="items-grid">
                            ${champion.items.map(itemId => {
                                const item = items.find(i => i.id == itemId);
                                return item ? `
                                    <div class="item" data-id="${item.id}">
                                        <div class="name">${item.nom}</div>
                                        <button class="remove-item">×</button>
                                    </div>
                                ` : '';
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="item-picker">
                        <select class="item-select">
                            ${items.filter(i => !champion.items.includes(i.id)).map(i => `
                                <option value="${i.id}" ${(favorites[champion.id] || []).includes(i.id) ? 'data-favorite' : ''}>
                                    ${i.nom} ${(favorites[champion.id] || []).includes(i.id) ? '★' : ''}
                                </option>
                            `).join('')}
                        </select>
                        <button class="add-item">Ajouter</button>
                    </div>
                </div>
            </div>
        `;
    }
};

export default Details;