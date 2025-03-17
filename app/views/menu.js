import Provider from "../provider.js";

async function loadChampionMenu() {
    const champions = await Provider.fetchData();
    const menuElement = document.getElementById("champion-menu");

    if (!menuElement) return;

    menuElement.innerHTML = champions.map(champ => `
        <li>
            <a href="#details?id=${champ.id}">${champ.nom}</a>
        </li>
    `).join('');
}

document.addEventListener("DOMContentLoaded", loadChampionMenu);
