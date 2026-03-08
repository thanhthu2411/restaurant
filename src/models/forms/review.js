import db from '../db.js';

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
    const review = result.rows[0];
    return {
        reviewId: review.id,
        restaurantId: review.restaurant_id,
        userId: review.user_id,
        rating: review.rating,
        content: review.content
    }
};

export {insertNewReview};