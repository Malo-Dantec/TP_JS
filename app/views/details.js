import Provider from "../provider.js";

const Details = {
    async render() {
        let urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        let champId = urlParams.get("id");
        
        const champions = await Provider.fetchData("champions");
        const champion = champions.find(champ => champ.id == champId);
        const items = await Provider.fetchData("items");

        if (!champion) {
            document.getElementById("app").innerHTML = "<p>Champion non trouvé.</p>";
            return;
        }

        document.getElementById("app").innerHTML = `
            <div class='champion-details'>
                <img src='${champion.image}' alt='${champion.nom}' />
                <h2>${champion.nom}</h2>
                <p>${champion.description || "Pas de description disponible."}</p>
                <h3>Équipements :</h3>
                <select id='item-select'>
                    ${items.map(item => `<option value='${item.id}'>${item.nom}</option>`).join('')}
                </select>
                <button onclick='Details.addItem(${champion.id})'>Ajouter</button>
                <h3>Note :</h3>
                <input type='number' id='rating' min='1' max='5' value='${champion.rating || 0}'>
                <button onclick='Details.rateChampion(${champion.id})'>Noter</button>
                <button onclick='Favoris.addFavorite(${champion.id})'>Ajouter aux favoris</button>
            </div>
        `;
    },

    async addItem(champId) {
        let selectedItem = document.getElementById('item-select').value;
        console.log(`Ajout de l'objet ${selectedItem} au champion ${champId}`);
        // POST/PUT request to add item to champion (could be implemented here)
    },

    async rateChampion(champId) {
        let rating = document.getElementById("rating").value;
        console.log(`Notation de ${rating} pour le champion ${champId}`);
        // POST request to update rating (could be implemented here)
    }
};

export default Details;
