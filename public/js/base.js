import { SideBarHandler, cartBtnHandler } from "./header.js";
import { dishCardHandler, reviewFormHandler } from "./restaurant.js";
import { checkOrderStatus } from "./order.js";

function init() {
    SideBarHandler();
    cartBtnHandler();
    dishCardHandler();
    reviewFormHandler();
    checkOrderStatus();
}

init();