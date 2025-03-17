import Provider from "../provider.js";

const Listing = {
    async render(page = 1) {
        const champions = await Provider.fetchChampions();
        const itemsPerPage = 5;
        const totalPages = Math.ceil(champions.length / itemsPerPage);
        const paginatedChampions = champions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        return `
            <div class="search-container">
                <input type="text" id="search" placeholder="Rechercher un champion..." class="search-input">
            </div>
            <div class="champions-grid">
                ${paginatedChampions.map(champ => `
                    <div class="champion-card" data-id="${champ.id}">
                        <img src="app/images/${champ.image}" alt="${champ.name}" loading="lazy" class="champion-image">
                        <div class="champion-info">
                            <h3>${champ.name}</h3>
                            <span class="champion-role">${champ.role}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="pagination">
                ${Array.from({ length: totalPages }, (_, i) => 
                    `<button class="page-btn ${i+1 === page ? 'active' : ''}" data-page="${i+1}">${i+1}</button>`
                ).join('')}
            </div>
        `;
    }
};

export default Listing;