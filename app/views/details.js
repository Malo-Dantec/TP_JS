import { fetchCharacters } from "../provider.js";

export async function loadDetailView() {
    const params = new URLSearchParams(window.location.hash.split("?")[1]);
    const characterId = parseInt(params.get("id"));
    const main = document.querySelector("#app");

    const characters = await fetchCharacters();
    const character = characters.find(c => c.id === characterId);

    if (!character) {
        main.innerHTML = "<p>Personnage introuvable</p>";
        return;
    }

    main.innerHTML = `
        <h2>${character.name}</h2>
        <img src="images/${character.image}" alt="${character.name}" width="200">
        <p>Jeu : ${character.game}</p>
        <p>Note : ${character.rating} ⭐</p>
        <button id="add-fav">Ajouter aux favoris</button>
    `;

    document.getElementById("add-fav").addEventListener("click", () => {
        let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
        if (!favoris.find(fav => fav.id === character.id)) {
            favoris.push(character);
            localStorage.setItem("favoris", JSON.stringify(favoris));
            alert("Ajouté aux favoris !");
        }
    });
}
