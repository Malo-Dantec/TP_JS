import Provider from "../provider.js";

const Listing = {
    async render(page = 1) {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const searchTerm = params.get('search');
        const roleFilter = params.get('role');
        const favoritesOnly = params.get('favorites') === 'true';
        
        let champions = await Provider.fetchChampions();
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // Application des filtres combinés
        if (favoritesOnly) champions = champions.filter(c => favorites.includes(c.id));
        if (searchTerm) {
            champions = champions.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (roleFilter) {
            champions = champions.filter(c => c.role === roleFilter);
        }

        // Pagination
        const itemsPerPage = champions.length;
        const totalPages = Math.ceil(champions.length / itemsPerPage);
        const paginated = champions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        return `
            <div class="controls">
                <div class="search-container">
                    <input type="text" id="search" placeholder="Rechercher..." value="${searchTerm || ''}">
                </div>
                <div class="filters-container">
                    <div class="role-filters">
                        ${['top', 'jungle', 'mid', 'bot', 'support'].map(role => `
                            <button class="role-filter ${role === roleFilter ? 'active' : ''}" data-role="${role}">
                                ${role.toUpperCase()}
                            </button>
                        `).join('')}
                    </div>
                    <button class="favorites-toggle ${favoritesOnly ? 'active' : ''}" 
                            onclick="window.location.hash = '#listing?favorites=${!favoritesOnly}'">
                        ★ Favoris
                    </button>
                </div>
            </div>
            <div class="champions-grid">
                ${paginated.map(c => `
                    <div class="champion-card" data-id="${c.id}">
                        <img src="app/images/${c.image}" alt="${c.name}" loading="lazy">
                        <div class="info">
                            <h3>${c.name}</h3>
                            <div class="meta">
                                <span class="role">${c.role}</span>
                                <button class="favorite-toggle" data-id="${c.id}">
                                    ${favorites.includes(c.id) ? '★' : '☆'}
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${totalPages > 1 ? `
                <div class="pagination">
                    ${Array.from({length: totalPages}, (_, i) => `
                        <button class="page-btn ${i+1 === page ? 'active' : ''}" 
                                data-page="${i+1}"
                                onclick="window.location.hash = '#listing?page=${i+1}${roleFilter ? `&role=${roleFilter}` : ''}${favoritesOnly ? '&favorites=true' : ''}'">
                            ${i+1}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }
};

export default Listing;