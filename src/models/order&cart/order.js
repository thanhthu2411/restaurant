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


export {getUserDishHistorybyRest};