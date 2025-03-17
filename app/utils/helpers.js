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
            <span class="stat-name">${key.toUpperCase()}</span>
            <span class="stat-value">${value}</span>
        </div>
    `).join('');
}