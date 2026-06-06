const SideBarHandler = () => {
  const menuBtn = document.querySelector(".menu-btn");
  const closeBtn = document.querySelector(".close-btn");
  const sidebarContainer = document.querySelector(".sidebar-container");

  menuBtn.addEventListener("click", () => {
    sidebarContainer.classList.toggle("open");
  });

  closeBtn.addEventListener("click", () => {
    sidebarContainer.classList.remove("open");
  });
};

const cartBtnHandler = () => {
  const cartBtn = document.querySelector(".cart-btn");
  const cartModal = document.querySelector(".cart-modal-container");
  const closeBtn = cartModal
    .querySelector(".wrapper")
    .querySelector(".close-btn");

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      cartModal.classList.toggle("cart-open");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      cartModal.classList.remove("cart-open");
    });
  }
};

const closeFlashBtnHandler = () => {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".flash-close-btn");
    if (!btn) return;
    const flashContainer = btn.closest(".flash");
    if(flashContainer) {
      flashContainer.remove();
    }
  });
};

// handle search form
const searchFormHandler = () => {
  const searchForm = document.getElementById("global-search-form")

  if(searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const query = document.getElementById("global-search-input").value.trim()
      if(!query) return

      // navigate to search page with query in URL
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    })
  }
}

// update cart number
const loadCart =  async () => {
  const cartNum = document.querySelector(".cart-num")

  try {
        const response = await fetch('/cart/api', {
          credentials: 'include'
        })

        if (!response.ok) throw new Error('Fail to update cart number')
        
        const result = await response.json()
        displayCart(result.cart, result.cartNumber)

  } catch(error) {
      console.error('Failed to load cart', error)
  }
}

function displayCart(cart, cartNumber) {
    const cartContainer = document.querySelector(".cart-restaurant-container")
    const cartNum = document.querySelector(".cart-num")

    cartNum.innerText = cartNumber

    if (Object.values(cart).length === 0) {
        cartContainer.innerHTML = `<p class="help-text">The cart is empty.<br>Add items to start.</p>`
        return
    }

    cartContainer.innerHTML = Object.values(cart)
        .filter(rest => rest.dishes.length > 0)
        .map(rest => `
            <div class="cart-rest-card">
                <a href="/restaurant/${rest.restaurantSlug}">${rest.restaurantName}</a>

                ${rest.dishes
                    .filter(dish => dish.quantity > 0)
                    .map(dish => `
                        <div class="cart-dish-container">
                            <img class="dish-img" 
                                 src="/images/dishes/${rest.restaurantSlug}-${dish.dishSlug}.jpg">
                            <div class="dish-info">
                                <p>${dish.dishName}</p>
                                <p class="dish-price">$${dish.price}</p>
                            </div>
                            <div class="dish-quantity">
                                <button class="decrease-btn" data-dish-slug="${dish.dishSlug}">-</button>
                                <span class="dish-quantity-span">${dish.quantity}</span>
                                <button class="increase-btn" data-dish-slug="${dish.dishSlug}">+</button>
                            </div>
                        </div>
                    `).join('')}

                <a class="checkout-link" href="/checkout/${rest.restaurantSlug}">Checkout</a>
            </div>
        `).join('')
}

const showToast = (message, type='success') => {
  const toast = document.getElementById('toast')
  if (!toast) return

  toast.textContent = message
  toast.className = `toast ${type}`
  toast.style.display = 'block'

  setTimeout(() => {
    toast.style.display = 'none'
  }, 3000)
}


const cartQuantityHander = () => {
  document.querySelector('.cart-restaurant-container').addEventListener('click', async (e) => {
      const increaseBtn = e.target.closest('.increase-btn')
      const decreaseBtn = e.target.closest('.decrease-btn')
      if (increaseBtn) {
          // handle increase
          const dishSlug = increaseBtn.dataset.dishSlug

          await fetchAndDisplay("increase", dishSlug);
      }

      if(decreaseBtn) {
          const dishSlug = decreaseBtn.dataset.dishSlug

          await fetchAndDisplay("decrease", dishSlug);

      }
  })
}

const fetchAndDisplay = async (action, dishSlug) => {
  try {
    const response = await fetch(`/cart/api/${action}/${dishSlug}`, {
      method: "POST",
      credentials: 'include'
    })

    if (!response.ok) throw new Error("Failed to increase the quantity of this item")
    const result = await response.json()
    displayCart(result.cart, result.cartNumber)
    showToast(result.message)
  } catch(error) {
    showToast("Something went wrong", "error")
    console.error(error)
  }
}

// const displayNewQuantity = (dishSlug, quantity) => {
//   document.querySelectorAll(".dish-quantity").forEach(dish => {
//     if (dish.dataset.dishSlug == dishSlug) {
//       dish.querySelector(".dish-quantity-span").innerText = quantity
//     }
//   })
// }



export { SideBarHandler, cartBtnHandler, closeFlashBtnHandler, searchFormHandler, loadCart, displayCart, showToast, cartQuantityHander };
