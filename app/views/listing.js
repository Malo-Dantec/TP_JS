import { fetchCharacters } from "../provider.js";

export async function loadListingView() {
    const main = document.querySelector("#app");
    const characters = await fetchCharacters();

    let html = "<h2>Liste des personnages</h2><ul>";
    characters.forEach(char => {
        html += `<li>
            <img src="images/${char.image}" alt="${char.name}" width="50">
            <a href="#details?id=${char.id}">${char.name} (${char.game})</a>
        </li>`;
    });
    html += "</ul>";

    main.innerHTML = html;
}
