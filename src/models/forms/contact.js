import db from '../db.js';

const insertContactForm = async (subject, message) => {
    const query =   `INSERT INTO contact_form (subject, message) 
                        VALUES ($1, $2) RETURNING *`;
    const result = await db.query(query, [subject, message]);
    return result.rows[0] || null;
};

// for admin 
const getAllContactForms = async () => {
    const query = `SELECT id, subject, message, submitted
                    FROM contact_form ORDER BY submitted DESC`;
    
    const result = await db.query(query);
    return result.rows;
}

export {insertContactForm, getAllContactForms};