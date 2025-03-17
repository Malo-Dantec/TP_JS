import Provider from "../provider.js";

const Details = {
    async render() {
        const id = window.location.hash.split('=')[1];
        const champion = await Provider.fetchChampion(id);
        const items = await Provider.fetchItems();

        return `
            <div class="champion-detail">
                <div class="champion-header">
                    <img src="app/images/${champion.image}" alt="${champion.name}" class="detail-image">
                    <div class="champion-meta">
                        <h1>${champion.name}</h1>
                        <div class="rating-container">
                            ${[1,2,3,4,5].map(i => 
                                `<span class="star ${i <= (champion.rating || 0) ? 'filled' : ''}" data-rating="${i}">★</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="item-builder">
                    <h3>Équipement du champion</h3>
                    <select class="item-select">
                        ${items.map(item => 
                            `<option value="${item.id}">${item.name}</option>`
                        ).join('')}
                    </select>
                    <button class="add-item-btn">Ajouter l'item</button>
                </div>
            </div>
        `;
    }
};

export default Details;