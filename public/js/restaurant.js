import { displayCart, showToast } from "./header.js";
// when a dish being clicked

// dishCardHandler only handles card clicks
const dishCardHandler = () => {
    const dishCards = document.querySelectorAll(".dish-card")
    const dishModal = document.querySelector(".menu-container-expand")

    if (!dishModal) {
        console.log("no dish modal")
        return
    }

    dishCards.forEach((card) => {
        card.addEventListener("click", () => {
            dishModal.querySelector("h2").textContent = card.dataset.name
            dishModal.querySelector("p").textContent = card.dataset.description
            dishModal.querySelector("img").src = card.dataset.imgUrl
            dishModal.querySelector("#add-to-cart-form").action = 
                `/cart/api/add/${card.dataset.restSlug}/${card.dataset.slug}`
            dishModal.classList.add("clicked")
        })
    })
}

const closeDishCard = () => {
    const modalCloseBtn = document.querySelector(".modal-close-btn")
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", () => {
            document.querySelector(".menu-container-expand").classList.remove("clicked")
        })
    }
}

// ADD TO CART FETCH API
const addToCartHandler = () => {
    const addToCartForm = document.getElementById("add-to-cart-form");

    if (addToCartForm) {
        addToCartForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const url = form.action;

            await fetchAndDisplay(url);
            })
    } 
}

async function fetchAndDisplay(url) {
    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to add item to cart');

        const result = await response.json();
        displayCart(result.cart, result.cartNumber);

        const dishModal = document.querySelector(".menu-container-expand");
        dishModal.classList.remove("clicked");
        showToast(result.message)

    } catch(error) {
        showToast('Something went wrong', 'error')
        console.error(error)
    }
}

// SEARCH INSIDE RESTAURANT
const resSearchHandler = () => {
    const searchForm = document.querySelector(".restaurant-search-form")
    if(!searchForm) return

    const url = searchForm.action;
    searchForm.addEventListener('submit',  async (e) => {
        e.preventDefault();
        // console.log("hi")
        const searchQuery = document.querySelector(".restaurant-search-form-input").value.trim()
        await fetchAndDisplaySearch(searchQuery, url)

    })
}

async function fetchAndDisplaySearch(query, url) {
    const resContainer = document.querySelector(".restaurant-main-container")

    try {
        const response = await fetch(`${url}/search?q=${encodeURIComponent(query)}`, {
            credentials: 'include'
            })        
        if (!response.ok) throw new Error('Search failed')
        
        const result = await response.json()

        displaySearchResults(result.dishes, query)
    } catch(error) {
        resContainer.innerHTML = `<p>Something went wrong. Please try again.</p>`
        console.error(error)
    }
}

function displaySearchResults(dishes, query) {
    const resContainer = document.querySelector(".restaurant-main-container")
    // before replacing content
    const originalContent = resContainer.innerHTML

    if (dishes.length === 0) {
        resContainer.innerHTML = '<p class="no-result">No Result Found</p>'
        return
    }

    resContainer.innerHTML = `
        <div class="dish-search-container">
            <button class="back-btn" id="search-back-btn">← Back</button>
            <h1>Search Result for "${query}"</h1>
            <div class="dishes-container">
                ${dishes.map(dish => `
                    <div class="dish-card"
                         data-name="${dish.dishName}"
                         data-description="${dish.dishDescription}"
                         data-img-url="/images/dishes/${dish.restaurantSlug}-${dish.dishSlug}.jpg"
                         data-rest-slug="${dish.restaurantSlug}"
                         data-slug="${dish.dishSlug}">
                        <img class="dish-img"
                             src="/images/dishes/${dish.restaurantSlug}-${dish.dishSlug}.jpg">
                        <div class="dish-info-container">
                            <span class="dish-name">${dish.dishName}</span>
                            <span class="dish-description">
                                ${dish.dishDescription.slice(0, 18)}...
                            </span>
                            <span class="price">$${dish.dishPrice}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`

    dishCardHandler() 

        // then in back button handler
    document.getElementById('search-back-btn').addEventListener('click', () => {
        resContainer.innerHTML = originalContent
        dishCardHandler()  // reattach modal listeners
    })
}

// REVIEW FORM
const reviewFormHandler = () => {
    const closeFormBtn = document.querySelector(".form-close-btn");
    const addReviewBtn = document.querySelector(".add-review-btn");
    const reviewForm = document.querySelector(".review-form-container");

    addReviewBtn.addEventListener("click", () => {
        reviewForm.classList.add("form-clicked");
    })

    closeFormBtn.addEventListener("click", () => {
        reviewForm.classList.remove("form-clicked");
    })
}

const ratingDataLabel = () => {
    const input = document.querySelector(".rating-input");
    const value = document.querySelector(".rating-value");

    input.addEventListener("input", () => {
        value.textContent = input.value;
    })
};


const loadReviews = async () => {
    // get restaurant slug from URL
    // URL is /restaurant/slug so split and grab last part
    const resSlug = window.location.pathname.split('/').pop()

    try {
        const response = await fetch(`/restaurant/${resSlug}/review`, {
            credentials: 'include'
        })
        if (!response.ok) return

        const result = await response.json()
        displayReview(result.reviews)

    } catch (error) {
        console.error('Failed to load reviews', error)
    }
}

const closeReviewForm = () => {
    const cancelBtn = document.querySelector(".cancel-review-btn")
    const reviewForm = document.querySelector(".review-form-container");

    if (!cancelBtn) return

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault()
        reviewForm.classList.remove("form-clicked");
    })
}

const addReviewHander = () => {
    const saveReviewBtn = document.querySelector(".save-review-btn")
    if (!saveReviewBtn) return

    saveReviewBtn.addEventListener("click", async (e) => {
        e.preventDefault()
        const url = document.querySelector(".review-form").action
        const rating = document.querySelector(".rating-input").value
        const review =  document.querySelector(".review-input").value
        if (!rating || !review) {
            showToast('Please fill in all fields', 'error')
            return
        }
        const reviewData = {
            rating: rating,
            review: review
        }
        await fetchAndDisplayReview(url, reviewData)
    })
}

async function fetchAndDisplayReview(url, reviewData) {
    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData)
        })

        if (!response.ok) {
            const result = await response.json()
            showToast(result.message, 'error')  // shows validation message to user
            return
        }
        
        const result = await response.json()
        displayReview(result.reviews)
        showToast(result.message)
    } catch(error) {
        console.error(error)
        showToast('Failed to save review', 'error')
    }
}

const displayReview = (reviews) => {
    const reviewContainer = document.querySelector(".rating-review-container")

    if (reviews.length === 0 || !reviews[0].id) {
        reviewContainer.innerHTML = `<p>No Review Available</p>`
        return
    }

    // ← let instead of const
    let averageRating = 0

    // ← reviews not review
    reviews.forEach((review) => {
        averageRating += Number(review.rating)
    })

    averageRating = (averageRating / reviews.length).toFixed(1)

    reviewContainer.innerHTML = `
        <div class="rating-container">
            <h2>${averageRating}</h2>
            <span>${getStars(averageRating)}</span>
            <p>${reviews.length} reviews</p>
        </div>
        <div class="review-container">
            ${reviews.map(review => `
                <div class="review-card">
                    <p class="review">${review.content}</p>
                    <span class="review-date">
                        ${getStars(review.rating)}
                        &#9679; ${review.createdAt}
                    </span>
                </div>
            `).join('')}
        </div>
    `
    document.querySelector(".review-form-container").classList.remove("form-clicked")
}

const getStars = (rating) => {
    if (rating < 2) return '★☆☆☆☆'
    if (rating < 3) return '★★☆☆☆'
    if (rating < 4) return '★★★☆☆'
    if (rating < 5) return '★★★★☆'
    return '★★★★★'
}

function init() {
    dishCardHandler();
    closeDishCard();
    reviewFormHandler();
    closeReviewForm();
    ratingDataLabel();
    addToCartHandler();
    resSearchHandler();
    addReviewHander();
    loadReviews();

}

init();
