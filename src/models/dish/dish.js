import db from "../db.js";

const getDishByRestaurantSlug = async (resSlug) => {
  const query = `SELECT d.id, d.restaurant_id, d.category_id,
                    d.name, d.slug, d.description, d.price, d.created_at FROM dishes d
        JOIN restaurants r ON d.restaurant_id = r.id
        WHERE r.slug = $1`;

  const result = await db.query(query, [resSlug]);
  if (result.rows.length === 0) return [];

  // console.log(result.rows);
  return result.rows.map((d) => ({
    id: d.id,
    restaurantId: d.restaurant_id,
    categoryId: d.category_id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    price: d.price,
    createdAt: d.created_at,
  }));
};

const getDishIdFromSlug = async (dishSlug) => {
  // get dishId from dishSlug
  const dishIdResult = await db.query(`SELECT id FROM dishes WHERE slug = $1`, [
    dishSlug,
  ]);
  const dishId = dishIdResult.rows[0]?.id;
  return dishId;
};

const getDishByCategory = async(param) => {
  const query = `SELECT r.name as "restaurantName", r.slug as "restaurantSlug", 
                    r.address as "restaurantAddress", r.open_hour as "openHour", r.close_hour as "closeHour", r.delivery_fee as "deliveryFee", r.delivery_minutes as "deliveryMinutes",
                    d.name as "dishName", d.slug as "dishSlug", d.description as "description", d.price as "dishPrice",
                    c.id as "categoryId", c.category_name as "categoryName", c.slug as "categorySlug"
                FROM dishes d LEFT JOIN restaurants r 
                    ON r.id = d.restaurant_id
                    LEFT JOIN categories c
                    ON c.id = d.category_id
                WHERE d.name ILIKE $1 OR c.category_name ILIKE $2`

    const results = await db.query(query, [`%${param}%`, `%${param}%`]);
    if (results.rows.length == 0) return [];
    let dishes = {}
    results.rows.forEach((row) => {
      if(!dishes[row.dishSlug]) {
        dishes[row.dishSlug] = {
          restaurantName: row.restaurantName,
          restaurantSlug: row.restaurantSlug,
          restaurantAddress: row.restaurantAddress,
          openHour: row.openHour,
          closeHour: row.closeHour,
          deliveryFee: row.deliveryFee,
          deliveryMinutes: row.deliveryMinutes,
          dishName: row.dishName,
          dishSlug: row.dishSlug,
          dishDescription: row.description,
          dishPrice: row.dishPrice,
          categoryId: row.categoryId,
          categoryName: row.categoryName
        }
      }
    })

    return Object.values(dishes);
}


const getDishbyCategoryandRest = async(param, resSlug) => {
    const query = `SELECT r.name as "restaurantName", r.slug as "restaurantSlug", 
                    r.address as "restaurantAddress", r.open_hour as "openHour", r.close_hour as "closeHour", r.delivery_fee as "deliveryFee", r.delivery_minutes as "deliveryMinutes",
                    d.name as "dishName", d.slug as "dishSlug", d.description as "description", d.price as "dishPrice",
                    c.id as "categoryId", c.category_name as "categoryName", c.slug as "categorySlug"
                FROM dishes d LEFT JOIN restaurants r 
                    ON r.id = d.restaurant_id
                    LEFT JOIN categories c
                    ON c.id = d.category_id
                WHERE r.slug = $1 AND d.name ILIKE $2`
    
      const results = await db.query(query, [resSlug, `%${param}%`]);
      if (results.rows.length == 0) return [];
      let dishes = {}

      results.rows.forEach(row => {
          if(!dishes[row.dishSlug]) {
          dishes[row.dishSlug] = {
            restaurantName: row.restaurantName,
            restaurantSlug: row.restaurantSlug,
            restaurantAddress: row.restaurantAddress,
            openHour: row.openHour,
            closeHour: row.closeHour,
            deliveryFee: row.deliveryFee,
            deliveryMinutes: row.deliveryMinutes,
            dishName: row.dishName,
            dishSlug: row.dishSlug,
            dishDescription: row.description,
            dishPrice: row.dishPrice,
            categoryId: row.categoryId,
            categoryName: row.categoryName
        }
      }
      })

      return Object.values(dishes)
}
export { getDishByRestaurantSlug, getDishIdFromSlug, getDishByCategory, getDishbyCategoryandRest };
