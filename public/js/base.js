import { SideBarHandler, cartBtnHandler, closeFlashBtnHandler, searchFormHandler, loadCart, cartQuantityHander } from "./header.js";

function init() {
    SideBarHandler();
    cartBtnHandler();
    closeFlashBtnHandler();
    searchFormHandler();
    loadCart(),
    cartQuantityHander()
}

init();