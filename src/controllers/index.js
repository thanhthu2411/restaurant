//define homePage(), restaurantPage(),

import {
  getDealRestaurant,
  getNearRestaurant,
  getRestaurantBySlug,
  getTopRestaurant,
  getOpenRestaurant,
} from "../models/restaurant/restaurant.js";
import { getReviewByRestaurant } from "../models/forms/review.js";
import { getDishByRestaurantSlug } from "../models/dish/dish.js";
import { getUserDishHistorybyRest } from "../models/order/order.js";

const homePage = async (req, res) => {
  try {
    const dealRestarantList = await getDealRestaurant();
    const nearRestaurantList = await getNearRestaurant();
    const topRestaurantList = await getTopRestaurant();
    const openRestaurantList = await getOpenRestaurant();

    res.render("home", {
      title: "Foodie",
      dealRestaurants: dealRestarantList,
      nearRestaurants: nearRestaurantList,
      topRestaurants: topRestaurantList,
      openRestaurants: openRestaurantList,
    });
  } catch (error) {
    console.error("Error loading home page:", error);

    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect(`/login`);
  }
};

const restaurantDetailPage = async (req, res, next) => {
  const resSlug = req.params.resSlug;

  if(!resSlug) {
    const err = new Error("Missing route parameter");
    err.status = 400;
    return next(err);
  }

  try {
    const restaurant = await getRestaurantBySlug(resSlug);
    if (Object.keys(restaurant).length === 0) {
      const err = new Error(`Restaurant ${resSlug} not found`);
      err.status = 404;
      return next(err);
    }
    const dishes = await getDishByRestaurantSlug(resSlug);
    const reviews = await getReviewByRestaurant(resSlug);
    console.log(reviews)
    let dishHistory = [];
    if (req.session && req.session.user) {
      const userId = req.session.user.id;
      dishHistory = await getUserDishHistorybyRest(userId, resSlug);
    }
    res.render("restaurant", {
      title: `${restaurant.name}`,
      restaurant: restaurant,
      dishes: dishes,
      reviews: reviews,
      dishHistory: dishHistory,
    });
  } catch (error) {
    console.error("Error loading restaurant page:", error);

    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect(`/`);
  }
};

export { homePage, restaurantDetailPage };
