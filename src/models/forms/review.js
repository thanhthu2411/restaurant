import db from "../db.js";

const reviewQuery = `SELECT r.id as "reviewId", r.rating, r.content, r.created_at as "createdAt",
                    r.user_id as "userId", r.restaurant_id as "restaurantId"`;

// get rating and review for a restaurant
const getReviewByRestaurant = async (resSlug) => {
  const query = `SELECT r.id, r.restaurant_id, r.user_id, r.rating,
                    r.content, r.created_at
                FROM restaurants re LEFT JOIN review r
                    ON r.restaurant_id = re.id
                WHERE re.slug = $1
                ORDER BY r.created_at DESC
                ;`;
  const result = await db.query(query, [resSlug]);
  if(result.rows.length === 0) return [];

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
    const query = `${reviewQuery}
            FROM review r 
            WHERE r.user_id = $1
            ORDER BY r.created_at DESC`;
    const result = await db.query(query, [userId]);

   return result.rows;
}

const getReviewById = async (reviewId) => {
    const query = `${reviewQuery}
            FROM review r
            WHERE r.id = $1`;
    const result = await db.query(query, [reviewId]);
   return result.rows[0] || null;
}

const insertNewReview = async (resSlug, userId, rating, content) => {
    const resIdQuery = `SELECT id FROM restaurants
                WHERE slug = $1 LIMIT 1`;
    const restIdResult = await db.query(resIdQuery, [resSlug]);
    if(restIdResult.rows.length === 0) {
        throw new Error('Restaurant not found');
    }
    const restId = restIdResult.rows[0].id;
    const query =`INSERT INTO review(restaurant_id, user_id, rating, content)
                VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await db.query(query, [restId, userId, rating, content]);
    if(result.rows.length === 0) return {};

    const review = result.rows[0];
    return {
        reviewId: review.id,
        restaurantId: review.restaurant_id,
        userId: review.user_id,
        rating: review.rating,
        content: review.content
    }
};

const deleteReviewById = async(reviewId, userId) => {
    const query = `DELETE FROM review r
                    WHERE id = $1 AND user_id = $2`;
    const result = await db.query(query, [reviewId, userId]);
    return result.rowCount > 0;
}

const updateReview = async (reviewId, rating, content) => {
    const query = `UPDATE review SET rating = $1, content = $2
                    WHERE id = $3`;
    const result = await db.query(query, [rating, content, reviewId]);
    return result.rowCount > 0;
}

export {getReviewByUserId, getReviewByRestaurant, insertNewReview, deleteReviewById, getReviewById, updateReview};