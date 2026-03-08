import db from "../db.js";

const createCartforUser = async (userId) => {
    const query = `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`;
    const result = await db.query(query, [userId]);
    
    return result.rows[0];
};

const getCartbyUser = async (userId) => {
  const query = `SELECT c.id as cartId, 
        r.id as restaurantId, r.slug as restaurantSlug, r.name as restaurantName, r.open_hour as openHour, r.close_hour as closeHour,
        r.delivery_fee as deliveryFee, r.delivery_minutes as deliveryMinutes,
        d.id as dishId, d.slug as dishSlug, d.name as dishName, d.price as dishPrice,
        cd.quantity as dishQuantity 
        FROM cart c LEFT JOIN cart_dish cd
            ON c.id = cd.cart_id
        LEFT JOIN dishes d ON
            d.id = cd.dish_id
        LEFT JOIN restaurants r ON
            r.id = d.restaurant_id
        WHERE c.user_id = $1`;

  const result = await db.query(query, [userId]);
  const cartResult = result.rows;

  let cart = {};
  cartResult.forEach((r) => {

    if(!r.restaurantId) return;

    if (!cart[r.restaurantId]) {
      cart[r.restaurantId] = {
        restaurantId: r.restaurantId,
        restaurantName: r.restaurantName,
        restaurantSlug: r.restaurantSlug,
        deliveryFee: r.deliveryFee,
        deliveryMinutes: r.deliveryMinutes,
        dishes: [],
      };
    };
    
    if(r.dishId) {
      cart[r.restaurantId].dishes.push({
        dishId: r.dishId,
        dishSlug: r.dishSlug,
        dishName: r.dishName,
        price: r.dishPrice,
        quantity: r.dishQuantity
      });
    }
  });

  return cart;
};


export {getCartbyUser, createCartforUser};


// {
//   3: {
//     restaurantId: 3,
//     restaurantName: "Pho King",
//     restaurantSlug: "pho-king",
//     deliveryFee: 3.99,
//     deliveryMinutes: 30,
//     dishes: [
//       {
//         dishId: 12,
//         dishName: "Pho Beef",
//         price: 14.99,
//         quantity: 2
//       },
//       {
//         dishId: 15,
//         dishName: "Spring Rolls",
//         price: 6.99,
//         quantity: 1
//       }
//     ]
//   },
// }