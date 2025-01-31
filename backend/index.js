const express = require( 'express' );
const cors = require( 'cors' );
const fetch = require( 'node-fetch' );
const fs = require( 'fs' );
const path = require( 'path' );
const bcrypt = require( 'bcrypt' );
const jwt = require( 'jsonwebtoken' );
const cookieParser = require( 'cookie-parser' );
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to enable CORS and parse JSON request bodies
app.use( cors() );
app.use( express.json() );
app.use( cookieParser() );

// JSON Web Token secret key
const JWT_SECRET = process.env.JWT_SECRET;

// @3X95gJTJZUeVSfY

// =========================
// HELPER FUNCTIONS
// =========================

// Path to the enrichment counts JSON file
const graphDataDir = path.join( __dirname, '/graph_data' );

// Ensure the graph data directory exists
if ( !fs.existsSync( graphDataDir ) ) {
    fs.mkdirSync( graphDataDir );
}

/**
 * Function to hash passwords and store them (for initial data setup)
 * @param {string} plainPassword - The unhashed password.
 * @returns {string} The hashed password.
 */
const hashPassword = async ( plainPassword ) => {
    const saltRounds = 10; // Number of hashing rounds
    const hashedPassword = await bcrypt.hash( plainPassword, saltRounds );
    return hashedPassword;
};

// =========================
// API ROUTES
// =========================

/**
 * POST /api/user/auth
 * Endpoint to authenticate user.
 * This will return a boolean (true/false) depending on login credentials.
 */
app.post( '/api/user/auth', async ( req, res ) => {

    // Set param and query variables
    const { username, password } = req.body;

    // Path to the enrichment counts JSON file
    const usersAuthPath = path.join( __dirname, '/authentication.json' );
  
    try {

        // If the file doesn't exist, skip read
        if( !fs.existsSync( usersAuthPath ) ) {
            res.status( 500 ).json({ error: 'Unable to read directory' });
        }

        // If the file exists, read and parse the data
        const authData = await fs.promises.readFile( usersAuthPath, 'utf-8' );
        const auth = JSON.parse( authData );

        // Check if user exists and password matches
        if ( auth[username] ) {

            // Hash password
            const hashedPassword = await hashPassword( password );

            // Store hash password
            const storedHashedPassword = auth[username];

            // Compare using bcrypt if password is hashed (recommended)
            const passwordMatch = await bcrypt.compare( password, storedHashedPassword );

            if ( passwordMatch ) {

                // Generate a JWT token
                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        
                // Return user authentication success along with the token
                return res.json({ authenticated: true, token });

            }

            // Return user authentication error
            return res.status( 401 ).json({ error: 'Invalid username or password' });

        } else {
            return res.json({ authenticated: false });
        }

    } catch ( err ) {
        console.error( 'Error reading the directory:', err );
        res.status( 500 ).json({ error: 'Unable to read directory' });
    }

});
  
/**
 * GET /api/verify-token
 * Endpoint to validate auth token.
 * This will return a success/error message.
 */
app.get( '/api/verify-token', (req, res) => {

    // Get the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting format: "Bearer <token>"

    // Check if token exists
    if ( !token ) {
        return res.status( 401 ).json({ error: 'Access denied' });
    }

    try {

        // Verify token
        const verified = jwt.verify( token, JWT_SECRET );
        return res.status( 200 ).json({ valid: true });

    } catch ( err ) {
        return res.status( 401 ).json({ error: 'Invalid or expired token' });
    }

});

/**
 * GET /api/auth-portal
 * Endpoint to get auth portal code.
 * This will return a success/error message.
 */
app.get( '/api/auth-portal', (req, res) => {
    res.sendFile( path.join( __dirname, '../frontend/build', 'index.html' ) );
});

// =========================
// STATIC FILES HANDLING
// =========================

/**
 * Serve static files from the React frontend app
 */
app.use( express.static( path.join( __dirname, '../frontend/build' ) ) );

/**
 * Catch-all handler: for any request that doesn't match above, send back React's index.html file.
 */
app.get( '*', ( req, res ) => {
  res.sendFile( path.join( __dirname, '../frontend/build', 'index.html' ) );
});

// =========================
// START SERVER
// =========================
app.listen( PORT, () => {
  console.log( `Server is running on port ${PORT}` );
});