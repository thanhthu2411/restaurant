import { SideBarHandler } from "./header.js";
import { dishCardHandler, reviewFormHandler } from "./restaurant.js";

function init() {
    SideBarHandler();
    dishCardHandler();
    reviewFormHandler();
}

init();