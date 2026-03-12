import db from '../db.js';

// get order history by restaurant and user
    // do later when implement login and session

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
  if (result.rows.length === 0) return false;

  const openHour = result.rows[0].open_hour;
  const closeHour = result.rows[0].close_hour;
  const currentTime = new Date().toLocaleTimeString('en-US', {
                        hour12: false});  
  let isOpen = false;
  if (closeHour >= currentTime && currentTime >= openHour) {
    isOpen = true;
  }

  return isOpen;
}


export {getUserDishHistorybyRest, isResOpen};