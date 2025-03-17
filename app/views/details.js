import Provider from "../provider.js";
const Details = {
    async render() {
        let urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        let champId = urlParams.get("id");
        const champion = await Provider.fetchData(`characters/${champId}`);
        const items = await Provider.fetchData("items");

        document.getElementById("app").innerHTML = `
            <div class='champion-details'>
                <img src='${champion.image}' alt='${champion.name}' />
                <h2>${champion.name}</h2>
                <p>${champion.description}</p>
                <h3>Équipements :</h3>
                <select id='item-select'>
                    ${items.map(item => `<option value='${item.id}'>${item.name}</option>`).join('')}
                </select>
                <button onclick='Details.addItem(${champId})'>Ajouter</button>
                <h3>Note :</h3>
                <input type='number' id='rating' min='1' max='5' value='${champion.rating || 0}'>
                <button onclick='Details.rateChampion(${champId})'>Noter</button>
                <button onclick='Favoris.addFavorite(${champId})'>Ajouter aux favoris</button>
            </div>
        `;
    },
    async addItem(champId) {
        let selectedItem = document.getElementById('item-select').value;
        console.log(`Ajout de l'objet ${selectedItem} au champion ${champId}`);
    },
    async rateChampion(champId) {
        let rating = document.getElementById("rating").value;
        console.log(`Notation de ${rating} pour le champion ${champId}`);
    }
};
export default Details;