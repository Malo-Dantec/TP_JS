import Provider from './provider.js';
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
        const params = new URLSearchParams(query); // Définit params ici
        const currentRoute = routes[hash] || Listing;
        const currentPage = parseInt(params.get('page')) || 1;
        
        document.getElementById('content').innerHTML = await currentRoute.render(currentPage);
        this.addEventListeners();
        
        // Focus sur la recherche si paramètre existe
        if (params.has('search')) {
            const searchInput = document.getElementById('search');
            if (searchInput) {
                searchInput.focus();
                // Optionnel : placer le curseur à la fin
                const searchTerm = params.get('search');
                searchInput.setSelectionRange(searchTerm.length, searchTerm.length);
            }
        }
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
            // Récupère les paramètres actuels
            const currentHashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
            
            // Focus automatique si recherche existante au chargement
            if (currentHashParams.has('search')) {
                searchInput.focus();
            }

            searchInput.addEventListener('input', debounce((e) => {
                const term = e.target.value;
                const newParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
                
                if (term) {
                    newParams.set('search', term);
                } else {
                    newParams.delete('search');
                }
                
                newParams.delete('page');
                window.location.hash = `#listing?${newParams.toString()}`;
                
                // Maintient le focus après le délai
                requestAnimationFrame(() => {
                    searchInput.focus();
                    // Place le curseur à la fin
                    searchInput.setSelectionRange(term.length, term.length);
                });
            }, 300));
        }

        // Gestion des notes
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', async (e) => {
                const championId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
                const rating = parseInt(e.target.dataset.rating);
                await Provider.saveChampionRating(championId, rating);
                Router.loadRoute();
            });
        });

        // Gestion de l'ajout d'item
        document.querySelector('.add-item-button')?.addEventListener('click', async () => {
            const select = document.querySelector('.item-select');
            const itemId = parseInt(select.value);
            const championId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');

            if (!championId || isNaN(itemId)) return;

            try {
                const champion = await Provider.fetchChampion(championId);
                if (champion.items.length >= 6) {
                    alert('Build complet (6 items maximum)');
                    return;
                }

                if (champion.items.includes(itemId)) {
                    alert('Cet item est déjà équipé');
                    return;
                }

                const updatedItems = [...champion.items, itemId];
                await Provider.updateChampionItems(championId, updatedItems);
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

        // Gestion de la suppression d'item
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = parseInt(e.target.closest('.item-card').dataset.id);
                const championId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');

                try {
                    const champion = await Provider.fetchChampion(championId);
                    const updatedItems = champion.items.filter(id => id !== itemId);
                    
                    await Provider.updateChampion(championId, { 
                        items: updatedItems,
                        stats: champion.stats // Réinitialiser les stats de base
                    });
                    
                    Router.loadRoute();
                } catch (error) {
                    console.error('Erreur suppression item:', error);
                }
            });
        });

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

        // Sauvegarde d'une nouvelle build
        document.querySelector('.save-kit-button')?.addEventListener('click', async () => {
            const championId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
            const champion = await Provider.fetchChampion(championId);
            const kitName = document.querySelector('.kit-name').value.trim();

            if (!kitName) {
                alert('Veuillez donner un nom à votre build');
                return;
            }

            if (champion.items.length === 0) {
                alert('Le build doit contenir au moins 1 item !');
                return;
            }

            await Provider.manageItemKits({
                name: kitName,
                items: [...champion.items],
                championId: championId
            }, 'save');

            Router.loadRoute();
        });

        // Chargement d'une build
        document.querySelectorAll('.load-kit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const kitId = e.target.dataset.id;
                const kits = await Provider.manageItemKits();
                const kit = kits.find(k => k.id === kitId);

                if (kit && confirm(`Charger le build "${kit.name}" ?`)) {
                    await Provider.updateChampion(kit.championId, { items: kit.items });
                    Router.loadRoute();
                }
            });
        });

        // Suppression d'une build
        document.querySelectorAll('.delete-kit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const kitId = e.target.dataset.id;
                if (confirm('Supprimer définitivement ce build ?')) {
                    await Provider.manageItemKits({ id: kitId }, 'delete');
                    Router.loadRoute();
                }
            });
        });

        // Renommage d'une build
        document.querySelectorAll('.rename-kit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const kitId = e.target.dataset.id;
                const kits = await Provider.manageItemKits();
                const kit = kits.find(k => k.id === kitId);
                const newName = prompt('Nouveau nom :', kit.name);

                if (newName) {
                    await Provider.manageItemKits({ 
                        id: kitId, 
                        name: newName 
                    }, 'update');
                    Router.loadRoute();
                }
            });
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
                    alert('Build complet (6 items maximum)');
                    return;
                }

                if (champion.items.includes(itemId)) {
                    alert('Cet item est déjà équipé');
                    return;
                }

                const updatedItems = [...champion.items, itemId];
                await Provider.updateChampionItems(championId, updatedItems);
                window.location.reload();
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