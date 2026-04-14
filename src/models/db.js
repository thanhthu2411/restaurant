
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CA certificate content
const caCert = fs.readFileSync(path.join(__dirname, '../../bin', 'byuicse-psql-cert.pem'));


const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
        checkServerIdentity: () => { return undefined; }
    },
    max: 3,                        
    idleTimeoutMillis: 30000,     
    connectionTimeoutMillis: 5000, 
});

pool.on('connect', (client) => {
    client.query("SET timezone='America/Denver'")  
    // BYU-Idaho is in Mountain Time
    // change to your preferred timezone
})

// ✅ Log pool errors so they don't silently crash the app
pool.on('error', (err) => {
    console.error('Unexpected database pool error:', err.message);
});

let db = null;

if (process.env.NODE_ENV.includes('dev') && process.env.ENABLE_SQL_LOGGING === 'true') {
    db = {
        async query(text, params) {
            try {
                const start = Date.now();
                const res = await pool.query(text, params);
                const duration = Date.now() - start;
                console.log('Executed query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    duration: `${duration}ms`,
                    rows: res.rowCount
                });
                return res;
            } catch (error) {
                console.error('Error in query:', {
                    text: text.replace(/\s+/g, ' ').trim(),
                    error: error.message
                });
                throw error;
            }
        },

        async close() {
            await pool.end();
        }
    };
} else {
    // db = pool;
    db = {
        query: pool.query.bind(pool),
        async close() { await pool.end() }  // ✅ add this
    }
}

export default db;
export { caCert };