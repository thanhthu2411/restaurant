import db from "../db.js";

const getAllUsers = async () => {
    const query = `SELECT id, role_id as "roleId", name, email, address, created_at as "createdAt"
                    FROM users
                    ORDER BY created_at`;
    const result = await db.query(query);
    if(result.rows.length === 0) return false;
    return result.rows;
};

export {getAllUsers};