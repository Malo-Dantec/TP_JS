import Provider from "../provider.js";

const Listing = {
    async render(page = 1) {
        const contentElement = document.getElementById("content");
        if (!contentElement) return;

        const champions = await Provider.fetchData();
        const itemsPerPage = 30;
        const totalPages = Math.ceil(champions.length / itemsPerPage);
        const paginatedChampions = champions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        contentElement.innerHTML = `
            <input type='text' id='search' placeholder='Rechercher un champion...' onkeyup='Listing.searchChampion()'>
            <div class='champions-list'>
                ${paginatedChampions.map(champ => `
                    <div class='champion' onclick="location.hash='#details?id=${champ.id}'">
                        <img src='${champ.image}' alt='${champ.nom}' loading='lazy'/>
                        <p>${champ.nom}</p>
                    </div>
                `).join('')}
            </div>
            <div class='pagination'>
                ${Array.from({ length: totalPages }, (_, i) => `<button onclick='Listing.render(${i + 1})'>${i + 1}</button>`).join('')}
            </div>
        `;
    },
    async searchChampion() {
        const searchElement = document.getElementById("search");
        if (!searchElement) return;

        let query = searchElement.value.toLowerCase();
        const champions = await Provider.fetchData();
        let filtered = champions.filter(champ => champ.nom.toLowerCase().includes(query));

        const listElement = document.querySelector(".champions-list");
        if (listElement) {
            listElement.innerHTML = filtered.map(champ => `
                <div class='champion' onclick="location.hash='#details?id=${champions.id}'">
                    <img src='${champions.images}' alt='${champions.nom}' loading='lazy'/>
                    <p>${champions.nom}</p>
                </div>
            `).join('');
        }
    }
};

export default Listing;
