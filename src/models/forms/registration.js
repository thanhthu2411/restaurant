import db from "../db.js";

// check if email already exist
const emailExist = async (email) => {
    const query = `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists`;
    const result = await db.query(query, [email]);
    return result.rows[0]?.exists;
}

//save user
const saveUser = async (name, email, password, address='') => {
    const query = `INSERT INTO users (name, email, password, address) 
                        VALUES ($1, $2, $3, $4) RETURNING id, name, email, address, created_at`;

    const result = await db.query(query, [name, email, password, address]);
    return result.rows[0] || null;
}

// get all user (for admin)
const getAllUsers = async () => {
    const query = `SELECT id, name, email, address, created_at FROM users`;
    const result = await db.query(query);
    if (result.rows.length === 0) return [];
    return result.rows;
}

// get users by id
const getUserById = async (id) => {
    const query = `
            SELECT 
                users.id,
                users.name,
                users.email,
                users.created_at,
                users.address,
                roles.role_name AS "roleName"
            FROM users
            INNER JOIN roles ON users.role_id = roles.id
            WHERE users.id = $1
        `;
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
}


// update user (user or admin)
const updateUser = async (id, name, email, address) => {
    const query = `
        UPDATE users 
        SET name = $1, email = $2, address = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, name, email, address, updated_at
    `;
    const result = await db.query(query, [name, email, address, id]);
    return result.rows[0] || null;
};



// delete user (user or admin)
const deleteUsser = async (id) => {
    const query = `DELETE FROM users WHERE id = $1`;
    const result = db.query(query, [id]);
    return result.rowCount > 0;
}

export {emailExist, saveUser, getAllUsers, getUserById, deleteUsser, updateUser};
