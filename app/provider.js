import CONFIG from './config.js';

class Provider {
    static async fetchData(endpoint) {
        const response = await fetch(`${CONFIG.ENDPOINT}/${endpoint}`);
        return response.json();
    }
}
export default Provider;