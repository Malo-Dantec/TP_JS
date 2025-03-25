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
            const currentRating = champion.rating || 0;
    
            // Corrigé: ajout de guillemets autour des valeurs par défaut
            const favorites = JSON.parse(localStorage.getItem('itemFavorites') || '{}');
            const savedKits = await Provider.getChampionKits(champion.id);
    
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
                                    ${(JSON.parse(localStorage.getItem('favorites') || '[]')).includes(champion.id) ? '★' : '☆'}
                                </button>
                            </h1>
                            <div class="champion-rating">
                                <h3>Notez ce champion</h3>
                                <div class="rating-stars">
                                    ${[1, 2, 3, 4, 5].map(star => `
                                        <span class="star ${star <= currentRating ? 'filled' : ''}" 
                                            data-rating="${star}"
                                            title="Noter ${star} étoile${star > 1 ? 's' : ''}">
                                            ★
                                        </span>
                                    `).join('')}
                                </div>
                                <small>${currentRating ? `Votre note : ${currentRating}/5` : 'Non noté'}</small>
                            </div>
                            <div class="champion-meta">
                                <span class="role">${champion.role}</span>
                                <span class="type">${champion.type.join(', ')}</span>
                            </div>
                            
                            <div class="stats-container">
                                ${updateStatsDisplay(this.calculateTotalStats(champion, items))}
                            </div>

                            <div class="current-build">
                                <h3>Build actuel (${champion.items.length}/6)</h3>
                                <div class="items-grid">
                                    ${champion.items.map(itemId => {
                                        const item = items.find(i => i.id == itemId); // Utilisation de == pour tolérer les types
                                        return item ? `
                                            <div class="item-card" data-id="${item.id}">
                                                <div class="item-name">${item.nom}</div>
                                                <div class="item-stats">${this.formatItemStats(item)}</div>
                                                <button class="remove-item">×</button>
                                            </div>
                                        ` : '';
                                    }).join('')}
                                </div>
                            </div>
                            <div class="kit-management">
                                <h3>Builds sauvegardés</h3>
                                
                                <div class="save-kit">
                                    <input type="text" class="kit-name" placeholder="Nom du build">
                                    <button class="save-kit-button">💾 Sauvegarder</button>
                                </div>
                                
                                <div class="saved-kits">
                                    ${savedKits.map(kit => `
                                        <div class="kit-item">
                                            <span class="kit-name">${kit.name}</span>
                                            <div class="kit-actions">
                                                <button class="load-kit" data-id="${kit.id}">⬆️</button>
                                                <button class="rename-kit" data-id="${kit.id}">✏️</button>
                                                <button class="delete-kit" data-id="${kit.id}">🗑️</button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="add-item-section">
                                <select class="item-select">
                                    ${items
                                        .filter(i => 
                                            !champion.items.includes(i.id) && // Exclure les items déjà équipés
                                            i.id // S'assurer que l'item existe
                                        )
                                        .map(i => `
                                            <option value="${i.id}">
                                                ${i.nom} (${this.formatItemStats(i)})
                                            </option>
                                        `).join('')}
                                </select>
                                <button class="add-item-button">Ajouter l'item</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
        } catch (error) {
            console.error(error);
            return '<div class="error">Erreur de chargement des détails</div>';
        }
    },

    formatItemStats(item) {
        return Object.entries(item.stats)
            .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
            .join(', ');
    },

    calculateTotalStats(champion, items) {
        const baseStats = { ...champion.stats };
        return champion.items.reduce((acc, itemId) => {
            const item = items.find(i => i.id == itemId); // Utilisation de == pour tolérer les types
            if (item) {
                Object.entries(item.stats).forEach(([stat, value]) => {
                    acc[stat] = (acc[stat] || 0) + value;
                });
            }
            return acc;
        }, baseStats);
    },

    calculateRating(championId) {
        const ratings = JSON.parse(localStorage.getItem('championRatings') || '{}');
        return ratings[championId] || 0;
    },
    
    async handleRatingClick(e) {
        const championId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
        const newRating = parseInt(e.target.dataset.rating);
        
        if (!championId || isNaN(newRating)) return;
    
        const ratings = JSON.parse(localStorage.getItem('championRatings') || '{}');
        ratings[championId] = newRating;
        localStorage.setItem('championRatings', JSON.stringify(ratings));
        
        Router.loadRoute();
    },
    
    refreshStats() {
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = updateStatsDisplay(
                this.calculateTotalStats(currentChampion, allItems)
            );
        }
    }
};

export default Details;