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

export { SideBarHandler, cartBtnHandler };
