import { loadListingView } from "./views/listing.js";
import { loadDetailView } from "./views/details.js";
import { loadFavorisView } from "./views/favoris.js";

function router() {
    const hash = window.location.hash.substring(1);
    const main = document.querySelector("#app");

    main.innerHTML = ""; // On vide le contenu

    switch (hash) {
        case "details":
            loadDetailView();
            break;
        case "favoris":
            loadFavorisView();
            break;
        default:
            loadListingView();
            break;
    }
}

window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
