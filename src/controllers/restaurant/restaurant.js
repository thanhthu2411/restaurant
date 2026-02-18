import { getAllRestaurant, getDealRestaurant, getNearRestaurant, getTopRestaurant, getRestaurantById } from "../../models/restaurant/restaurant.js"

const restaurantPage = (req, res) => {
    const dealRestaurants = getDealRestaurant();
    const nearRestaurant = getNearRestaurant();
    const topRestaurant = getTopRestaurant();

    const context = {
        title: 'bitebuddy',
        dealRes: dealRestaurants,
        nearRes: nearRestaurant,
        topRes: topRestaurant
    }

    res.render('home', context)
}

const restaurantDetailPage = (req, res, next) => {
    const resId = req.params.resId;
    const restaurant = getRestaurantById(resId);

    if(!restaurant) {
        const err = new Error(`Restaurant Not Found`);
        err.status = 404;
        return next(err);
    }

    res.render('restaurant', {
        title: `${restaurant.name}`,
        restaurant: restaurant
    })
}

export {restaurantPage, restaurantDetailPage}