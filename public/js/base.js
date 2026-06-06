import { SideBarHandler, cartBtnHandler, closeFlashBtnHandler, searchFormHandler, loadCart, cartQuantityHander } from "./header.js";
// import { dishCardHandler, reviewFormHandler } from "./restaurant.js";

function init() {
    SideBarHandler();
    cartBtnHandler();
    closeFlashBtnHandler();
    searchFormHandler();
    // cartNumberHandler();
    loadCart(),
    cartQuantityHander()
}

init();