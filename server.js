// Imports
import express from "express";
import { fileURLToPath } from "url";
import path from "path";

/**
 * Declare Important VARIABLEs
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
/**
 * Setup Express Server
 */
const app = express();

/**
 * Configure Express MIDDLEWARE
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

/**
 * Declare ROUTES
 */
app.get("/", (req, res) => {
  res.render("home", { title });
});

// START the server and listen on the specified port
