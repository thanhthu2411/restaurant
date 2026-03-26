// when a dish being clicked
const dishCardHandler = () => {
    const dishCards = document.querySelectorAll(".dish-card");
    const dishModal = document.querySelector(".menu-container-expand");
    const modalCloseBtn = dishModal.querySelector(".modal-close-btn");
    
    dishCards.forEach((card) => {
        card.addEventListener("click", () => {

            dishModal.querySelector("h2").textContent = card.dataset.name;
            dishModal.querySelector("p").textContent = card.dataset.description;
            dishModal.querySelector("img").src = card.dataset.imgUrl;
            dishModal.querySelector("#add-to-cart-form").action = `/cart/add/${card.dataset.restSlug}/${card.dataset.slug}`;
            dishModal.classList.add("clicked");
        })
    })

    modalCloseBtn.addEventListener("click", () => {
        dishModal.classList.remove("clicked");
    })
}

//handle add review button
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

function init() {
    dishCardHandler();
    reviewFormHandler();
    ratingDataLabel();
}

init();
