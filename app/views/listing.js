import Provider from "../provider.js";
const Listing = {
    async render(page = 1) {
        const champions = await Provider.fetchData("characters");
        const itemsPerPage = 5;
        const totalPages = Math.ceil(champions.length / itemsPerPage);
        const paginatedChampions = champions.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        document.getElementById("app").innerHTML = `
            <input type='text' id='search' placeholder='Rechercher un champion...' onkeyup='Listing.searchChampion()'>
            <div class='champions-list'>
                ${paginatedChampions.map(champ => `
                    <div class='champion' onclick="location.hash='#details?id=${champ.id}'">
                        <img src='${champ.image}' alt='${champ.name}' loading='lazy'/>
                        <p>${champ.name}</p>
                    </div>
                `).join('')}
            </div>
            <div class='pagination'>
                ${Array.from({ length: totalPages }, (_, i) => `<button onclick='Listing.render(${i + 1})'>${i + 1}</button>`).join('')}
            </div>
        `;
    },
    async searchChampion() {
        let query = document.getElementById("search").value.toLowerCase();
        const champions = await Provider.fetchData("characters");
        let filtered = champions.filter(champ => champ.name.toLowerCase().includes(query));
        document.querySelector(".champions-list").innerHTML = filtered.map(champ => `
            <div class='champion' onclick="location.hash='#details?id=${champ.id}'">
                <img src='${champ.image}' alt='${champ.name}' loading='lazy'/>
                <p>${champ.name}</p>
            </div>
        `).join('');
    }
};
export default Listing;