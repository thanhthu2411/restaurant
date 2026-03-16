import db from "../db.js";

// get rating and review for a restaurant
const getReviewByRestaurant = async (resSlug) => {
  const query = `SELECT r.id, r.restaurant_id, r.user_id, r.rating,
                    r.content, r.created_at
                FROM restaurants re LEFT JOIN review r
                    ON r.restaurant_id = re.id
                WHERE re.slug = $1;`;
  const result = await db.query(query, [resSlug]);
    // console.log(result.rows);
  return result.rows.map(review => ({
    id: review.id,
    restaurantId: review.restaurant_id,
    userId: review.user_id,
    rating: review.rating,
    content: review.content,
    createdAt: new Date(review.created_at).toISOString().slice(0,10)
  })) 
};

const getReviewByUserId = async (userId) => {
    const query = `SELECT r.id as "reviewId", r.rating, r.content, r.created_at as "createdAt"
            FROM review r 
            WHERE r.user_id = $1`;
    const result = await db.query(query, [userId]);
    if (result.rows.length === 0) return [];

   return result.rows;
}

export {getReviewByUserId, getReviewByRestaurant};