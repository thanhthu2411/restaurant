import db from "../db.js";
import { getCartDishbyUserAndRestaurant } from "./cart.js";
import { calculatePrice } from "../../utils/calculatePrice.js";
import { getRestaurantIdFromSlug } from "../restaurant/restaurant.js";

const getUserDishHistorybyRest = async (userId, restaurantSlug) => {
  const query = `
    SELECT DISTINCT d.id AS dishId, d.name, d.slug,
      d.description, d.price
    FROM orders o
    LEFT JOIN restaurants r ON o.restaurant_id = r.id
    LEFT JOIN order_dish od ON o.id = od.order_id
    LEFT JOIN dishes d ON od.dish_id = d.id
    WHERE o.user_id = $1 AND r.slug = $2
  `;

  const result = await db.query(query, [userId, restaurantSlug]);
  return result.rows;
};

const isResOpen = async (resSlug) => {
  const hourQuery = `SELECT open_hour, close_hour FROM restaurants WHERE slug = $1`;
  const result = await db.query(hourQuery, [resSlug]);
  if (result.rows.length === 0) return null;

  const openHour = result.rows[0].open_hour;
  const closeHour = result.rows[0].close_hour;
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
  });
  let isOpen = false;
  if (closeHour >= currentTime && currentTime >= openHour) {
    isOpen = true;
  }

  return isOpen;
};

const saveNewOrder = async (userId, resSlug) => {
  const order = await getCartDishbyUserAndRestaurant(resSlug, userId);
  if (!order) return false;
  const resId = await getRestaurantIdFromSlug(resSlug);
  if (!resId) return false;
  const prices = calculatePrice(order);

  const orderQuery = `INSERT INTO orders (user_id, restaurant_id, status_id, subtotal, total, delivery_fee, delivery_minutes)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id as "orderId" `;
  const result = await db.query(orderQuery, [
    userId,
    resId,
    1,
    prices.subtotal,
    prices.total,
    prices.deliveryFee,
    order.deliveryMinutes,
  ]);
  const orderId = result.rows[0].orderId;
  const orderDishQuery = `INSERT INTO order_dish(order_id, dish_id, quantity, order_price) 
                            VALUES ($1, $2, $3, $4) `;

  for (const dish of order.dishes) {
    const orderDishResult = await db.query(orderDishQuery, [
      orderId,
      dish.dishId,
      dish.quantity,
      dish.price,
    ]);
  }

  return orderId;
};

const getOrderById = async (userId, orderId) => {
  const orderQuery = `SELECT o.id as "orderId", o.subtotal, o.total, o.delivery_fee as "deliveryFee", o.delivery_minutes as "deliveryMinutes", o.created_at as "orderCreateTime",
              r.name as "restaurantName", r.slug as "restaurantSlug", 
              u.name as "userName", u.email as "userEmail", u.address as "userAddress",
              d.name as "dishName", d.slug as "dishSlug", 
              od.quantity, od.order_price as "dishPrice",
              os.id as "orderStatusId", os.status as "orderStatus"
              FROM orders o LEFT JOIN order_dish od
                ON od.order_id = o.id
              LEFT JOIN restaurants r ON o.restaurant_id = r.id
              LEFT JOIN order_status os ON o.status_id = os.id
              LEFT JOIN dishes d ON od.dish_id = d.id
              LEFT JOIN users u ON o.user_id = u.id
              WHERE o.user_id = $1 AND o.id = $2
              ORDER BY od.order_id`;
  const result = await db.query(orderQuery, [userId, orderId]);
  if (result.rows.length === 0) return null;
  const orderInfo = result.rows[0];
  const tax = (orderInfo.subtotal * 0.1).toFixed(2);

  let order = {
    orderId: orderInfo.orderId,
    subtotal: orderInfo.subtotal,
    total: orderInfo.total,
    tax: tax,
    deliveryFee: orderInfo.deliveryFee,
    deliveryMinutes: orderInfo.deliveryMinutes,
    orderCreatedTime: new Date(orderInfo.orderCreateTime),
    restaurantName: orderInfo.restaurantName,
    restaurantSlug: orderInfo.restaurantSlug,
    userName: orderInfo.userName,
    userEmail: orderInfo.userEmail,
    userAddress: orderInfo.userAddress,
    orderStatusId: orderInfo.orderStatusId,
    orderStatus: orderInfo.orderStatus,
    dishes: [],
  };

  result.rows.forEach((o) => {
    order.dishes.push({
      dishName: o.dishName,
      dishSlug: o.dishSlug,
      dishPrice: o.dishPrice,
      dishQuantity: o.quantity,
    });
  });

  return order;
};

const getOrderByOrderId = async (orderId) => {
  const orderQuery = `SELECT o.id as "orderId", o.subtotal, o.total, o.delivery_fee as "deliveryFee", o.delivery_minutes as "deliveryMinutes", o.created_at as "orderCreateTime",
              r.name as "restaurantName", r.slug as "restaurantSlug", 
              u.name as "userName", u.email as "userEmail", u.address as "userAddress",
              d.name as "dishName", d.slug as "dishSlug", 
              od.quantity, od.order_price as "dishPrice",
              os.id as "orderStatusId", os.status as "orderStatus"
              FROM orders o LEFT JOIN order_dish od
                ON od.order_id = o.id
              LEFT JOIN restaurants r ON o.restaurant_id = r.id
              LEFT JOIN order_status os ON o.status_id = os.id
              LEFT JOIN dishes d ON od.dish_id = d.id
              LEFT JOIN users u ON o.user_id = u.id
              WHERE o.id = $1
              ORDER BY od.order_id`;
  const result = await db.query(orderQuery, [orderId]);
  if (result.rows.length === 0) return null;
  const orderInfo = result.rows[0];
  const tax = (orderInfo.subtotal * 0.1).toFixed(2);

  let order = {
    orderId: orderInfo.orderId,
    subtotal: orderInfo.subtotal,
    total: orderInfo.total,
    tax: tax,
    deliveryFee: orderInfo.deliveryFee,
    deliveryMinutes: orderInfo.deliveryMinutes,
    orderCreatedTime: new Date(orderInfo.orderCreateTime),
    restaurantName: orderInfo.restaurantName,
    restaurantSlug: orderInfo.restaurantSlug,
    userName: orderInfo.userName,
    userEmail: orderInfo.userEmail,
    userAddress: orderInfo.userAddress,
    orderStatusId: orderInfo.orderStatusId,
    orderStatus: orderInfo.orderStatus,
    dishes: [],
  };

  result.rows.forEach((o) => {
    order.dishes.push({
      dishName: o.dishName,
      dishSlug: o.dishSlug,
      dishPrice: o.dishPrice,
      dishQuantity: o.quantity,
    });
  });

  return order;
};

//update order status
const updateOrderStatus = async (orderId, status) => {
  const statusIdResult = await db.query(
    `SELECT id FROM order_status WHERE LOWER(status) = LOWER($1)`,
    [status],
  );
  const statusId = statusIdResult.rows[0].id;

  if (!statusId) return false;

  const query = `UPDATE orders SET status_id = $1
                    WHERE id = $2 RETURNING *`;
  const result = await db.query(query, [statusId, orderId]);
  return result.rowCount > 0;
};

// for user dashboard
const getOrderByUserId = async (userId) => {
  const query = `SELECT o.id as "orderId", o.subtotal, o.total, o.delivery_fee as "deliveryFee", o.delivery_minutes as "deliveryMinutes", o.created_at as "orderCreateTime",
              r.name as "restaurantName", r.slug as "restaurantSlug", 
              d.id as "dishId", d.name as "dishName", d.slug as "dishSlug", 
              od.quantity, od.order_price as "dishPrice",
              os.id as "orderStatusId", os.status as "orderStatus"
              FROM orders o LEFT JOIN order_dish od
                ON od.order_id = o.id
              LEFT JOIN restaurants r ON o.restaurant_id = r.id
              LEFT JOIN order_status os ON o.status_id = os.id
              LEFT JOIN dishes d ON od.dish_id = d.id
              LEFT JOIN users u ON o.user_id = u.id
              WHERE o.user_id = $1
              `;
  const result = await db.query(query, [userId]);
  if (result.rows.length === 0) return [];

  let orders = {};
  result.rows.forEach((row) => {
    if (!row.orderId) return;

    if (!orders[row.orderId]) {
      orders[row.orderId] = {
        orderId: row.orderId,
        subtotal: row.subtotal,
        total: row.total,
        deliveryFee: row.deliveryFee,
        deliveryMinutes: row.deliveryMinutes,
        orderCreatedTime: new Date(row.orderCreateTime).toLocaleDateString(),
        restaurantName: row.restaurantName,
        restaurantSlug: row.restaurantSlug,
        orderStatusId: row.orderStatusId,
        orderStatus: row.orderStatus,
        dishes: [],
      };
    }

    if (row.dishId) {
      orders[row.orderId].dishes.push({
        dishId: row.dishId,
        dishName: row.dishName,
        dishSlug: row.dishSlug,
        dishPrice: row.dishPrice,
        dishQuantity: row.quantity,
      });
    }
  });

  return Object.values(orders);
};

const getOrderByRestaurantOwner = async (ownerId) => {
  const query = `SELECT o.id as "orderId", o.subtotal, o.total, o.delivery_fee as "deliveryFee", o.delivery_minutes as "deliveryMinutes", o.created_at as "orderCreateTime",
              r.name as "restaurantName", r.slug as "restaurantSlug", 
              d.id as "dishId", d.name as "dishName", d.slug as "dishSlug", 
              od.quantity, od.order_price as "dishPrice",
              os.id as "orderStatusId", os.status as "orderStatus"
              FROM orders o LEFT JOIN order_dish od
                ON od.order_id = o.id
              LEFT JOIN restaurants r ON o.restaurant_id = r.id
              LEFT JOIN order_status os ON o.status_id = os.id
              LEFT JOIN dishes d ON od.dish_id = d.id
              WHERE r.owner_id = $1 AND os.status != 'delivered'
              ORDER BY o.created_at DESC`;
  const result = await db.query(query, [ownerId]);
  if (result.rows.length === 0) return [];

  let orders = {};
  result.rows.forEach((row) => {
    if (!row.orderId) return;

    if (!orders[row.orderId]) {
      orders[row.orderId] = {
        orderId: row.orderId,
        subtotal: row.subtotal,
        total: row.total,
        deliveryFee: row.deliveryFee,
        deliveryMinutes: row.deliveryMinutes,
        orderCreatedTime: new Date(row.orderCreateTime).toLocaleString(),
        restaurantName: row.restaurantName,
        restaurantSlug: row.restaurantSlug,
        orderStatusId: row.orderStatusId,
        orderStatus: row.orderStatus,
        dishes: [],
      };
    }

    if (row.dishId) {
      orders[row.orderId].dishes.push({
        dishId: row.dishId,
        dishName: row.dishName,
        dishSlug: row.dishSlug,
        dishPrice: row.dishPrice,
        dishQuantity: row.quantity,
      });
    }
  });

  return Object.values(orders);
};

export {
  getUserDishHistorybyRest,
  isResOpen,
  saveNewOrder,
  getOrderById,
  updateOrderStatus,
  getOrderByUserId,
  getOrderByRestaurantOwner,
  getOrderByOrderId
};
