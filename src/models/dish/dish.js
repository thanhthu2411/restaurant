import db from "../db.js";

const getDishByRestaurantSlug = async (resSlug) => {
    const query = `SELECT d.id, d.restaurant_id, d.category_id,
                    d.name, d.slug, d.description, d.price, d.created_at FROM dishes d
        JOIN restaurants r ON d.restaurant_id = r.id
        WHERE r.slug = $1`;
    
    const result = await db.query(query, [resSlug]);
    // console.log(result.rows);
    return result.rows.map(d => ({
        id: d.id,
        restaurantId: d.restaurant_id,
        categoryId: d.category_id,
        name: d.name,
        slug: d.slug,
        description: d.description,
        price: d.price,
        createdAt: d.created_at
    }));
};

export {getDishByRestaurantSlug};