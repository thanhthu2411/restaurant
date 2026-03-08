//define homePage(), restaurantPage(), 

import { getDealRestaurant, getNearRestaurant, getRestaurantBySlug, getTopRestaurant, getOpenRestaurant, getReviewByRestaurant } from "../models/restaurant/restaurant.js";
import { getDishByRestaurantSlug } from "../models/dish/dish.js";
import { getUserDishHistorybyRest } from "../models/order&cart/order.js";

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

const restaurantDetailPage = async (req, res) => {
    const resSlug = req.params.resSlug;
    const restaurant = await getRestaurantBySlug(resSlug);
    const dishes = await getDishByRestaurantSlug(resSlug);
    const reviews = await getReviewByRestaurant(resSlug);

    let dishHistory = [];
    if (req.session && req.session.user) {
        const userId = req.session.user.id;
        dishHistory = await getUserDishHistorybyRest(userId, resSlug);
    }
    res.render('restaurant', {
        title: `${restaurant.name}`,
        restaurant: restaurant,
        dishes: dishes,
        reviews: reviews,
        dishHistory: dishHistory 
    })
}

export {homePage, restaurantDetailPage};