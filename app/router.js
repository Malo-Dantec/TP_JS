import Listing from './views/listing.js';
import Details from './views/details.js';
import { debounce } from './utils/helpers.js';

const routes = {
    '/': Listing,
    '#listing': Listing,
    '#details': Details,
};

class Router {
    static async loadRoute() {
        const [hash, query] = window.location.hash.split('?');
        const params = new URLSearchParams(query);
        const currentRoute = routes[hash] || Listing;
        const currentPage = parseInt(params.get('page')) || 1; // Récupération du paramètre page
        
        document.getElementById('content').innerHTML = await currentRoute.render(currentPage); // Passage du paramètre
        this.addEventListeners();
    }

    static addEventListeners() {
        // Redirection sur la page détail du champion
        document.querySelectorAll('.champion-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Empêche la navigation si on clique sur le bouton favori
                if (!e.target.closest('.favorite-toggle')) {
                    const championId = card.dataset.id;
                    window.location.hash = `#details?id=${championId}`;
                }
            });
        });

        // Gestion recherche
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                const term = e.target.value;
                window.location.hash = `#listing?search=${term}`;
            }, 300));
        }

        // Gestion de l'ajout d'item
        document.querySelector('.add-item-button')?.addEventListener('click', async () => {
            const select = document.querySelector('.item-select');
            const itemId = parseInt(select.value);
            const championId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');

            if (!championId || isNaN(itemId)) return;

            try {
                const champion = await Provider.fetchChampion(championId);
                if (champion.items.length >= 6) {
                    alert('Build complète (6 items maximum)');
                    return;
                }

                if (champion.items.includes(itemId)) {
                    alert('Cet item est déjà équipé');
                    return;
                }

                const updatedItems = [...champion.items, itemId];
                await Provider.updateChampion(championId, { items: updatedItems });
                Router.loadRoute();
            } catch (error) {
                console.error('Erreur ajout item:', error);
            }
        });

        // Gestion des favoris par champion
        document.querySelector('.toggle-favorite-item')?.addEventListener('click', async () => {
            const championId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
            const itemId = parseInt(document.querySelector('.item-select').value); // Correction ici
            
            if (!championId || isNaN(itemId)) return;
        
            await Provider.toggleItemFavorite(championId, itemId);
            Router.loadRoute();
        });

        // Filtres par rôle
        document.querySelectorAll('.role-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                const currentParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
                const currentRole = currentParams.get('role');
                const newRole = btn.dataset.role === currentRole ? null : btn.dataset.role;
                
                if (newRole) {
                    currentParams.set('role', newRole);
                } else {
                    currentParams.delete('role');
                }
                
                currentParams.delete('page');
                window.location.hash = `#listing?${currentParams.toString()}`;
            });
        });

        // Gestion favoris champions
        document.querySelectorAll('.favorites-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const currentParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
                const newFavorites = btn.dataset.favorites === 'true';
                
                if (newFavorites) {
                    currentParams.set('favorites', 'true');
                } else {
                    currentParams.delete('favorites');
                }
                
                currentParams.delete('page'); // Réinitialiser la pagination
                window.location.hash = `#listing?${currentParams.toString()}`;
            });
        });

        // Gestion du filtre par rôle
        const roleFilter = document.getElementById('role-filter');
        if (roleFilter) {
            roleFilter.addEventListener('change', () => {
                const role = roleFilter.value;
                window.location.hash = `#listing?role=${role}`;
            });
        }

        // Favoris dans Details
        document.querySelector('.favorite-detail')?.addEventListener('click', async (e) => {
            const championId = e.target.dataset.id;
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            const index = favorites.indexOf(championId);
            
            if (index > -1) {
                favorites.splice(index, 1);
            } else {
                favorites.push(championId);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
            e.target.textContent = index > -1 ? '☆' : '★';
        });

         // Gestion de l'ajout d'item
        document.querySelector('.add-item-btn')?.addEventListener('click', async () => {
            const select = document.querySelector('.item-select');
            const itemId = parseInt(select.value);
            const championId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');

            if (!championId || isNaN(itemId)) return;

            try {
                const champion = await Provider.fetchChampion(championId);
                if (champion.items.length >= 6) {
                    alert('Build complète (6 items maximum)');
                    return;
                }

                if (champion.items.includes(itemId)) {
                    alert('Cet item est déjà équipé');
                    return;
                }

                const updatedItems = [...champion.items, itemId];
                await Provider.updateChampion(championId, { items: updatedItems });
                Router.loadRoute(); // Recharge la vue
            } catch (error) {
                console.error('Erreur ajout item:', error);
            }
        });
    }
}

window.addEventListener('hashchange', () => Router.loadRoute());
window.addEventListener('load', () => Router.loadRoute());

export default Router;