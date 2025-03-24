export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function updateStatsDisplay(stats) {
    return Object.entries(stats).map(([key, value]) => `
        <div class="stat-item">
            <img src="app/images/stats/${key}.png" alt="${key}" class="stat-icon">
            <span class="stat-value">${value}</span>
        </div>
    `).join('');
}