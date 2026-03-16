import { query } from "express-validator";
import db from "../db.js";
import { getDishIdFromSlug } from "../dish/dish.js";

// for every new registered user, create a new cart
const createCartforUser = async (userId) => {
  const query = `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`;
  const result = await db.query(query, [userId]);

  return result.rows[0];
};

const getCartbyUser = async (userId) => {
  const query = `SELECT c.id as "cartId", 
        r.id as "restaurantId", r.slug as "restaurantSlug", r.name as "restaurantName", r.open_hour as "openHour", r.close_hour as "closeHour",
        r.delivery_fee as "deliveryFee", r.delivery_minutes as "deliveryMinutes",
        d.id as "dishId", d.slug as "dishSlug", d.name as "dishName", d.price as "dishPrice",
        cd.quantity as "dishQuantity" 
        FROM cart c LEFT JOIN cart_dish cd
            ON c.id = cd.cart_id
        LEFT JOIN dishes d ON
            d.id = cd.dish_id
        LEFT JOIN restaurants r ON
            r.id = d.restaurant_id
        WHERE c.user_id = $1`;

  const result = await db.query(query, [userId]);
  const cartResult = result.rows;
  // return cartResult;
  let cart = {};
  cartResult.forEach((r) => {
    if (!r.restaurantId) return;

    if (!cart[r.restaurantId]) {
      cart[r.restaurantId] = {
        restaurantId: r.restaurantId,
        restaurantName: r.restaurantName,
        restaurantSlug: r.restaurantSlug,
        deliveryFee: r.deliveryFee,
        deliveryMinutes: r.deliveryMinutes,
        dishes: [],
      };
    }

    if (r.dishId) {
      cart[r.restaurantId].dishes.push({
        dishId: r.dishId,
        dishSlug: r.dishSlug,
        dishName: r.dishName,
        price: r.dishPrice,
        quantity: r.dishQuantity,
      });
    }
  });

  return cart;
};

const getOrCreateCartId = async (userId) => {
  //get cartId from userId
  const cartIdQuery = `SELECT id FROM cart 
                      WHERE user_id = $1`;
  const cartQueryResult = await db.query(cartIdQuery, [userId]);
  let cartId = cartQueryResult.rows[0]?.id;
  //if user doesn't have a cart
  if (!cartId) {
    const result = await db.query(
      `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`,
      [userId],
    );
    cartId = result.rows[0]?.id;
  }

  return cartId;
};


const addDishtoCart = async (dishSlug, userId) => {
  const cartId = await getOrCreateCartId(userId);
  const dishId = await getDishIdFromSlug(dishSlug);

  //insert dish into cart or increase quantity
  const dishExistQuery = `SELECT EXISTS (SELECT 1 FROM cart_dish WHERE dish_id = $1 AND cart_id = $2) as has_dish;`;
  const dishExistResult = await db.query(dishExistQuery, [dishId, cartId]);
  const dishExist = dishExistResult.rows[0]?.has_dish;
  if (dishExist) {
    const updateQuery = `UPDATE cart_dish SET quantity = quantity + 1
                      WHERE cart_id = $1 AND dish_id = $2`;
    await db.query(updateQuery, [cartId, dishId]);
    return true;
  }

  const insertQuery = `INSERT INTO cart_dish (cart_id, dish_id, quantity) VALUES ($1, $2, 1) RETURNING *`;
  const result = await db.query(insertQuery, [cartId, dishId]);
  return result.rows[0];
};

const increaseDishQuantity = async (dishSlug, userId) => {
  const cartId = await getOrCreateCartId(userId);
  const dishId = await getDishIdFromSlug(dishSlug);

  const increaseQuery = `UPDATE cart_dish SET quantity = quantity + 1
                      WHERE cart_id = $1 AND dish_id = $2 RETURNING *`;
  const result = await db.query(increaseQuery, [cartId, dishId]);
  return result.rows[0];
};

const decreaseDishQuantity = async (dishSlug, userId) => {
  const cartId = await getOrCreateCartId(userId);
  const dishId = await getDishIdFromSlug(dishSlug);

  const decreaseQuery = `UPDATE cart_dish SET quantity = quantity - 1
                      WHERE cart_id = $1 AND dish_id = $2 AND quantity > 0 RETURNING *`;
  const result = await db.query(decreaseQuery, [cartId, dishId]);
  if(result.rowCount === 0) {
    return false;
  }

  const quantity = result.rows[0].quantity;
  if (quantity === 0) {
    await db.query(`DELETE FROM cart_dish WHERE cart_id=$1 AND dish_id = $2`, [cartId, dishId]);
  }
  return true;
};


const getCartDishbyUserAndRestaurant = async (resSlug, userId) => {
  const cartId = await getOrCreateCartId(userId);
  const query = `SELECT d.id, d.category_id as "categoryId", d.name as "dishName", d.slug as "dishSlug", d.description, d.price,
                        r.id as "restaurantId", r.deal_id as "dealId", r.name as "restaurantName", r.slug as "restaurantSlug", 
                        r.address, r.delivery_fee as "deliveryFee", r.delivery_minutes as "deliveryMinutes",
                        cd.quantity, cd.cart_id as "cartId",
                        u.role_id as "roleId", u.name as "userName", u.email as "userEmail", u.address as "userAddress",
                        deals.name as "dealName", deals.code as "dealCode", deals.description as "dealDescription", deals.expiration_date as "expirationDate", deals.amount as "dealAmount"
                  FROM cart_dish cd INNER JOIN dishes d
                    ON cd.dish_id = d.id
                    INNER JOIN restaurants r
                    ON r.id = d.restaurant_id
                    LEFT JOIN deals
                    ON deals.id = r.deal_id
                    LEFT JOIN cart c 
                    ON c.id = cd.cart_id
                    LEFT JOIN users u
                    ON c.user_id = u.id
                    WHERE r.slug = $1 AND cd.cart_id = $2`;
  const result = await db.query(query, [resSlug, cartId]);
  if (result.rows.length === 0) return false;

  const resResult = result.rows[0];
  const dishResult = result.rows;
  let order = {
    cartId: resResult.cartId,
    restaurantId: resResult.restaurantId,
    dealId: resResult.dealId,
    restaurantName: resResult.restaurantName,
    restaurantSlug: resResult.restaurantSlug,
    address: resResult.address,
    deliveryFee: resResult.deliveryFee,
    deliveryMinutes: resResult.deliveryMinutes,
    dealName: resResult.dealName,
    dealCode: resResult.dealCode,
    dealDescription: resResult.dealDescription,
    expirationDate: resResult.expirationDate,
    dealAmount: resResult.dealAmount,
    roleId: resResult.roleId,
    userName: resResult.userName,
    userEmail: resResult.userEmail,
    userAddress: resResult.userAddress,
    dishes: []
  };

  dishResult.forEach(dish => {
    order.dishes.push ({
      dishId: dish.id,
      categoryId: dish.categoryId,
      dishName: dish.dishName,
      dishSlug: dish.dishSlug,
      description: dish.description,
      price: dish.price,
      quantity: dish.quantity
    })
  });

  return order;
}

export { getCartbyUser, createCartforUser, addDishtoCart, increaseDishQuantity, decreaseDishQuantity,
          getCartDishbyUserAndRestaurant
 };
