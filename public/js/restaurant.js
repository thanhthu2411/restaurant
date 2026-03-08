// when a dish being clicked
export const dishCardHandler = () => {
    const dishCards = document.querySelectorAll(".dish-card");
    const dishModal = document.querySelector(".menu-container-expand");
    const modalCloseBtn = dishModal.querySelector(".modal-close-btn");
    
    dishCards.forEach((card) => {
        card.addEventListener("click", () => {

            dishModal.querySelector("h2").textContent = card.dataset.name;
            dishModal.querySelector("p").textContent = card.dataset.description;
            dishModal.querySelector("img").src = card.dataset.imgUrl;
            dishModal.querySelector("#add-to-cart-form").action = `/cart/add/${card.dataset.slug}`;
            dishModal.classList.add("clicked");
        })
    })

    modalCloseBtn.addEventListener("click", () => {
        dishModal.classList.remove("clicked");
    })
}

//handle add review button
export const reviewFormHandler = () => {
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

