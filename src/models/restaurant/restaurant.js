import db from "../db.js";

const getNearRestaurant = async () => {
  const query = `SELECT * FROM restaurants 
            WHERE delivery_minutes <= 15
            ORDER BY delivery_minutes`;
  const result = await db.query(query);
  if (result.rows.length === 0) return [];

  return result.rows.map((r) => ({
    id: r.id,
    ownerId: r.owner_id,
    dealId: r.deal_id,
    name: r.name,
    slug: r.slug,
    address: r.address,
    openHour: r.open_hour,
    closeHour: r.close_hour,
    deliveryFee: r.delivery_fee,
    deliveryMinutes: r.delivery_minutes,
    createdAt: r.created_at,
  }));
};

const getDealRestaurant = async () => {
  const query = `SELECT r.id, r.owner_id, r.deal_id, r.name as restaurant_name, r.slug as restaurant_slug, r.address, r.open_hour, r.close_hour,
                    r.delivery_fee, r.delivery_minutes, d.name as deal_name, d.code as deal_code, d.description as deal_description, d.expiration_date as expiration_date, d.amount as deal_amount FROM deals d 
        JOIN restaurants r ON d.id = r.deal_id
        WHERE r.deal_id IS NOT NULL`;

  const result = await db.query(query);
  if (result.rows.length === 0) return [];

  return result.rows.map((r) => ({
    id: r.id,
    ownerId: r.owner_id,
    dealId: r.deal_id,
    name: r.restaurant_name,
    slug: r.restaurant_slug,
    address: r.address,
    openHour: r.open_hour,
    closeHour: r.close_hour,
    deliveryFee: r.delivery_fee,
    deliveryMinutes: r.delivery_minutes,
    dealName: r.deal_name,
    dealCode: r.deal_code,
    dealDescription: r.deal_description,
    expirationDate: r.expiration_date,
    dealAmount: r.deal_amount,
  }));
};

const getTopRestaurant = async () => {
  const query = `
        SELECT r.id,r.owner_id, r.deal_id, r.name AS restaurant_name,r.slug AS restaurant_slug, r.address,
            r.open_hour, r.close_hour, r.delivery_fee, r.delivery_minutes, AVG(re.rating) AS average_rating
        FROM restaurants r
        JOIN review re ON re.restaurant_id = r.id
        GROUP BY 
            r.id, r.owner_id, r.deal_id, r.name, r.slug, r.address, r.open_hour,
            r.close_hour, r.delivery_fee, r.delivery_minutes
        HAVING AVG(re.rating) >= 4.5
        ORDER BY average_rating DESC
    `;

  const result = await db.query(query);
  if(result.rows.length === 0) return [];

  return result.rows.map((r) => ({
    id: r.id,
    ownerId: r.owner_id,
    dealId: r.deal_id,
    name: r.restaurant_name,
    slug: r.restaurant_slug,
    address: r.address,
    openHour: r.open_hour,
    closeHour: r.close_hour,
    deliveryFee: r.delivery_fee,
    deliveryMinutes: r.delivery_minutes,
    averageRating: r.average_rating,
  }));
};

const getRestaurantBySlug = async (restaurantSlug) => {
  const query = `SELECT r.id, r.owner_id, r.deal_id, r.name AS restaurant_name,r.slug AS restaurant_slug, r.address,
            r.open_hour, r.close_hour, r.delivery_fee, r.delivery_minutes, AVG(re.rating) AS average_rating,
            d.name as deal_name, d.code as deal_code, d.description as deal_description, d.expiration_date as expiration_date, d.amount as deal_amount 
        FROM restaurants r
        LEFT JOIN review re ON re.restaurant_id = r.id
        LEFT JOIN deals d ON d.id = r.deal_id
        WHERE slug = $1
        GROUP BY 
            r.id, r.owner_id, r.deal_id, r.name, r.slug, r.address, r.open_hour,
            r.close_hour, r.delivery_fee, r.delivery_minutes,
            d.name, d.code, d.description, d.expiration_date, d.amount`;

  const result = await db.query(query, [restaurantSlug]);
  const r = result.rows[0];

  return {
    id: r.id,
    ownerId: r.owner_id,
    dealId: r.deal_id,
    name: r.restaurant_name,
    slug: r.restaurant_slug,
    address: r.address,
    openHour: r.open_hour,
    closeHour: r.close_hour,
    deliveryFee: r.delivery_fee,
    deliveryMinutes: r.delivery_minutes,
    averageRating: r.average_rating,
    dealName: r.deal_name,
    dealCode: r.deal_code,
    dealDescription: r.deal_description,
    expirationDate: r.expiration_date,
    dealAmount: r.deal_amount,
  };
};

const getOpenRestaurant = async () => {
  const query = `SELECT *
        FROM restaurants
        WHERE CURRENT_TIME BETWEEN open_hour AND close_hour`;

  const result = await db.query(query);
  if(result.rows.length === 0) return [];

  return result.rows.map((r) => ({
    id: r.id,
    ownerId: r.owner_id,
    dealId: r.deal_id,
    name: r.name,
    slug: r.slug,
    address: r.address,
    openHour: r.open_hour,
    closeHour: r.close_hour,
    deliveryFee: r.delivery_fee,
    deliveryMinutes: r.delivery_minutes,
    createdAt: r.created_at,
  }));
};

const getRestaurantIdFromSlug = async (resSlug) => {
  const restaurantRestaurant = await db.query(
    `SELECT id FROM restaurants WHERE slug = $1`,
    [resSlug],
  );
  const restaurantId = restaurantRestaurant.rows[0]?.id;
  return restaurantId;
};

const getAllRestaurantsAndDishes = async () => {
  const query = `SELECT r.id as "restaurantId", r.name as "restaurantName", r.slug as "restaurantSlug", 
                    r.address as "restaurantAddress", r.open_hour as "openHour", r.close_hour as "closeHour", r.delivery_fee as "deliveryFee", r.delivery_minutes as "deliveryMinutes",
                    d.name as "dishName", d.slug as "dishSlug", 
                    d.description as "description", d.price as "dishPrice"
                    FROM restaurants r
                    LEFT JOIN dishes d ON d.restaurant_id = r.id`;
  const result = await db.query(query);
  if (result.rows.length === 0) return [];
  let restaurants = {};

  result.rows.forEach((row) => {
    if (!restaurants[row.restaurantId]) {
      restaurants[row.restaurantId] = {
        restaurantId: row.restaurantId,
        restaurantName: row.restaurantName,
        restaurantSlug: row.restaurantSlug,
        restaurantAddress: row.restaurantAddress,
        openHour: row.openHour,
        closeHour: row.closeHour,
        deliveryFee: row.deliveryFee,
        deliveryMinutes: row.deliveryMinutes,
        dishes: [],
      };
    }

    if (row.dishName) {
      restaurants[row.restaurantId].dishes.push({
        dishName: row.dishName,
        dishSlug: row.dishSlug,
        description: row.description,
        dishPrice: row.dishPrice,
      });
    }
  });

  return Object.values(restaurants);
};

export {
  getNearRestaurant,
  getDealRestaurant,
  getRestaurantBySlug,
  getTopRestaurant,
  getOpenRestaurant,
  getRestaurantIdFromSlug,
  getAllRestaurantsAndDishes,
};
