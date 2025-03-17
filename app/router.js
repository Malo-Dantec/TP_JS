import Listing from './views/listing.js';
import Details from './views/details.js';
import Favoris from './views/favoris.js';

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
        // Gestion des clics sur les cartes de champions
        document.querySelectorAll('.champion-card').forEach(card => {
            card.addEventListener('click', () => {
                const championId = card.dataset.id;
                window.location.hash = `#details?id=${championId}`;
            });
        });

        // Gestion de la pagination
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                window.location.hash = `#listing?page=${page}`;
            });
        });
    }
}

window.addEventListener('hashchange', () => Router.loadRoute());
window.addEventListener('load', () => Router.loadRoute());

export default Router;