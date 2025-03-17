const Favoris = {
    addFavorite(champId) {
        let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
        if (!favoris.includes(champId)) favoris.push(champId);
        localStorage.setItem('favoris', JSON.stringify(favoris));
        alert("Ajouté aux favoris !");
    },

    render() {
        let favoris = JSON.parse(localStorage.getItem('favoris')) || [];
        document.getElementById("app").innerHTML = `
            <h2>Favoris</h2>
            ${favoris.map(id => `<p>Champion ${id}</p>`).join('')}
        `;
    }
};

export default Favoris;
