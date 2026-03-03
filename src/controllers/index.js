//define homePage(), restaurantPage(), 

import { getDealRestaurant, getNearRestaurant, getRestaurantBySlug, getTopRestaurant, getOpenRestaurant, getReviewByRestaurant } from "../models/restaurant/restaurant.js";
import { getDishByRestaurantSlug } from "../models/dish/dish.js";

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

    res.render('restaurant', {
        title: `${restaurant.name}`,
        restaurant: restaurant,
        dishes: dishes,
        reviews: reviews
    })
}

export {homePage, restaurantDetailPage};