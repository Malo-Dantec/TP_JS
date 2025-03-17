function loadMenu() {
    const menu = document.createElement('nav');
    menu.id = 'menu';
    menu.innerHTML = `
        <a href="#home">Accueil</a>
        <a href="#favorites">Favoris</a>
    `;
    document.body.prepend(menu);
}

document.addEventListener('DOMContentLoaded', loadMenu);