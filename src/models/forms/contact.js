import db from '../db.js';

const insertContactForm = async (subject, message, userId=null, status) => {
    const query =   `INSERT INTO contact_form (subject, message, user_id, status) 
                        VALUES ($1, $2, $3, $4) RETURNING *`;
    const result = await db.query(query, [subject, message, userId, 'unread']);
    return result.rows[0] || null;
};

// for admin 
const getAllContactForms = async () => {
    const query = `SELECT cf.id as "contactId", subject, message, submitted, cf.user_id as "userId",
                        status, reply_message as "replyMessage", replied_at as "repliedAt",
                        u.name as "userName", u.email as "userEmail"
                    FROM contact_form cf
                    LEFT JOIN users u ON u.id = cf.user_id
                    ORDER BY submitted DESC`;
    
    const result = await db.query(query);
    return result.rows;
}

export {insertContactForm, getAllContactForms};