import { API_URL } from "./config.js";

export async function fetchCharacters() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des personnages", error);
        return [];
    }
}
