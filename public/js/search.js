// runs when search results page loads
document.addEventListener('DOMContentLoaded', async () => {
    // read query from URL — /search?q=pizza → "pizza"
    const params = new URLSearchParams(window.location.search)
    const query = params.get('q')

    if (!query) {
        document.getElementById('search-results').innerHTML = 
            '<p>Enter something to search</p>'
        return
    }

    await fetchAndDisplay(query)
})

async function fetchAndDisplay(query) {
    const container = document.getElementById('search-results')

    try {
        container.innerHTML = '<p class="loading">Searching...</p>'

        const response = await fetch(`/search/results?q=${encodeURIComponent(query)}`)

        if (!response.ok) throw new Error('Search failed')

        const result = await response.json()

        displayResults(result.data, result.query)

    } catch (error) {
        container.innerHTML = '<p>Something went wrong. Please try again.</p>'
        console.error(error)
    }
}

function displayResults(dishes, query) {
    const container = document.getElementById('search-results')

    if (dishes.length === 0) {
        container.innerHTML = '<p class="no-result">No Result Found</p>'
        return
    }

    // same structure as your old EJS template — keeps your CSS working
    container.innerHTML = `
        <div class="dish-search-container">
            <h1>Search Result for "${query}"</h1>
            <div class="dishes-container">
                ${dishes.map(dish => `
                    <div class="dish-card">
                        <img class="dish-img" 
                             src="/images/dishes/${dish.restaurantSlug}-${dish.dishSlug}.jpg">
                        <a href="/restaurant/${dish.restaurantSlug}" 
                           class="dish-info-container">
                            <h2>${dish.restaurantName}</h2>
                            <span class="dish-name">${dish.dishName}</span>
                            <span class="dish-description">
                                ${dish.dishDescription.slice(0, 18)}...
                            </span>
                            <span class="price">$${dish.dishPrice}</span>
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>
    `
}