import Listing from './views/listing.js';
import Details from './views/details.js';
import Favoris from './views/favoris.js';
import { debounce } from './utils/helpers.js';

const routes = {
    '/': Listing,
    '#listing': Listing,
    '#details': Details,
    '#favoris': Favoris
};

class Router {
    static async loadRoute() {
        const [hash, query] = window.location.hash.split('?');
        const currentRoute = routes[hash] || Listing;
        
        document.getElementById('content').innerHTML = await currentRoute.render();
        this.addEventListeners();
    }

    static addEventListeners() {
        // Gestion recherche
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                const term = e.target.value;
                window.location.hash = `#listing?search=${term}`;
            }, 300));
        }

        // Filtres par rôle
        document.querySelectorAll('.role-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                const role = btn.dataset.role;
                window.location.hash = `#listing?role=${role}`;
            });
        });

        // Gestion favoris champions
        document.querySelectorAll('.favorite-toggle').forEach(btn => {
            btn.addEventListener('click', async () => {
                const championId = btn.dataset.id;
                const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                const index = favorites.indexOf(championId);
                
                if (index > -1) {
                    favorites.splice(index, 1);
                } else {
                    favorites.push(championId);
                }
                localStorage.setItem('favorites', JSON.stringify(favorites));
                btn.textContent = index > -1 ? '☆' : '★';
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
    }
}

window.addEventListener('hashchange', () => Router.loadRoute());
window.addEventListener('load', () => Router.loadRoute());

export default Router;