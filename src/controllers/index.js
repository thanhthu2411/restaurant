//define homePage(), restaurantPage(), 

import { getDealRestaurant, getNearRestaurant, getRestaurantBySlug, getTopRestaurant, getOpenRestaurant } from "../models/restaurant/restaurant.js";

const homePage = async (req, res) => {
    const dealRestarantList = await getDealRestaurant();
    const nearRestaurantList = await getNearRestaurant();
    const topRestaurantList = await getTopRestaurant();
    const openRestaurantList = await getOpenRestaurant();

    res.render('home', {
        title: 'Foodie',
        dealRestaurants: dealRestarantList,
        nearRestaurants: nearRestaurantList,
        topRestaurants: topRestaurantList,
        openRestaurants: openRestaurantList
    });
};

export {homePage};