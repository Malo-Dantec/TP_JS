export function loadFavorisView() {
    const main = document.querySelector("#app");
    let favoris = JSON.parse(localStorage.getItem("favoris")) || [];

    if (favoris.length === 0) {
        main.innerHTML = "<p>Aucun favori</p>";
        return;
    }

    let html = "<h2>Favoris</h2><ul>";
    favoris.forEach(char => {
        html += `<li>
            <img src="images/${char.image}" alt="${char.name}" width="50">
            ${char.name} (${char.game})
        </li>`;
    });
    html += "</ul>";

    main.innerHTML = html;
}
