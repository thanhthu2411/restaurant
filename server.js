// Imports
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

import router from "./src/controllers/routes.js";
import {addLocalVariables} from "./src/middleware/global.js"

import { setupDatabase, testConnection } from "./src/models/setup.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { caCert } from "./src/models/db.js";
import { startSessionCleanup } from "./src/utils/session-cleanup.js";
//import session, flash, databaseSetup, databaseConnection

/**
 * Setup Express Server
 */
const app = express();
/**
 * Declare Important VARIABLEs
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);

// Configure session middleware
app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: process.env.DB_URL,
            // Configure SSL for session store connection (required by BYU-I databases)
            ssl: {
                ca: caCert,
                rejectUnauthorized: true,
                checkServerIdentity: () => { return undefined; }
            }
        },
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

startSessionCleanup();

/**
 * Configure Express
 */
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//Global middleware
app.use(addLocalVariables);

// FLASH MESSAGE

/**
 * Declare ROUTES
 */
app.use("/", router);

/**
 * Error handling
 */
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
})

// global error handler
app.use((err, req, res, next) => {
    if(res.headersSent || res.finished) {
        return next(err);
    }

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    const context = {
        title: status===404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occured' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV
    };

    try {
        res.status(status).render(`errors/${template}`, context);
    } catch(renderErr) {
        if(!res.headersSent) {
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
})

// WebSocket
// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

// START the server and listen on the specified port
app.listen(PORT, async () => {
    //SET UP DATABASE
    await setupDatabase();
    await testConnection();
    console.log(`Server is running on http://127.0.0.1:${PORT}`)
})