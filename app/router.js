document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("hashchange", () => Router.loadRoute());
    Router.loadRoute();
});

class Router {
    static routes = {
        '': 'listing',
        '#listing': 'listing',
        '#details': 'details',
        '#favoris': 'favoris'
    };
    static async loadRoute() {
        const viewName = Router.routes[location.hash] || 'listing';
        const module = await import(`./views/${viewName}.js`);
        module.default.render();
    }
}