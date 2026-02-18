
const SideBarHandler = () => {
    const menuBtn = document.querySelector(".menu-btn");
    const closeBtn = document.querySelector(".close-btn");
    const sidebarContainer = document.querySelector(".sidebar-container");

    menuBtn.addEventListener("click", () => {
        sidebarContainer.classList.toggle("open");
    })

    closeBtn.addEventListener("click", () => {
        sidebarContainer.classList.remove("open");
    })
}

export {SideBarHandler};