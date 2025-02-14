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

// $#IkMEU9SVw!O8y%

// Middleware to enable CORS and parse JSON request bodies
app.use( cors() );
app.use( express.json() );
app.use( cookieParser() );

// JSON Web Token secret key
const JWT_SECRET = process.env.JWT_SECRET;

// =========================
// HELPER FUNCTIONS
// =========================

// Path to the enrichment counts JSON file
const authFilePath = path.join(__dirname, 'authentication.json');
const defaultAuthFilePath = path.join(__dirname, 'default.authentication.json');

// Check if authentication.json exists, if not, create it from default.authentication.json
if ( !fs.existsSync( authFilePath ) ) {
    if ( fs.existsSync( defaultAuthFilePath ) ) {
        fs.copyFileSync( defaultAuthFilePath, authFilePath );
        console.log( 'The authentication.json file was missing and has been created from default.authentication.json' );
    } else {
        console.error( 'Error: default.authentication.json does not exist. Cannot create authentication.json' );
    }
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

/**
 * Generate a random secure password with at least 16 characters
 * @param {string} length - The password length.
 * @returns {string} The secure password.
 */
const generateSecurePassword = ( length = 16 ) => {
    return crypto.randomBytes( length ).toString( 'base64' ) // Base64 encoding
        .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
        .slice( 0, length ); // Ensure exact length
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
  
    try {

        // If the file exists, read and parse the data
        const authData = await fs.promises.readFile( authFilePath, 'utf-8' );
        const auth = JSON.parse( authData );

        // Check if user exists and password matches
        if ( auth[username] ) {

            // Hash password
            const hashedPassword = await hashPassword( password );

            // Store hash password
            const storedHashedPassword = auth[username].password;

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
 * GET /api/user/verify-role
 * Endpoint to check user role.
 * This will return a success/error message.
 */
app.get( '/api/user/verify-role', async (req, res) => {

    // Set param and query variables
    const { username } = req.query;

    try {

        // If the file exists, read and parse the data
        const authData = await fs.promises.readFile( authFilePath, 'utf-8' );
        const auth = JSON.parse( authData );

        // Check if user exists and password matches
        if ( !auth[username] ) {
            return res.status( 401 ).json({ error: 'Invalid username' });
        } else {
            return res.json({ role: auth[username].role });
        }

    } catch ( err ) {
        return res.status( 401 ).json({ error: 'Invalid username' });
    }

});

/**
 * GET /api/user/create
 * Endpoint to create new user.
 * This will return a success/error message.
 */
app.post( '/api/user/create', async (req, res) => {

    // Set param and query variables
    const { username, password, role } = req.body;
  
    try {

        // If the file doesn't exist, skip read
        if( !fs.existsSync( authFilePath ) ) {
            res.status( 500 ).json({ error: 'Unable to read directory' });
        }

        // If the file exists, read and parse the data
        const userData = await fs.promises.readFile( authFilePath, 'utf-8' );
        const users = JSON.parse( userData );

        // Check if user exists
        if ( !users[username] ) {

            // Hash password
            const hashedPassword = await hashPassword( password );

            // Add new user
            users[username] = {
                role: role,
                password: hashedPassword
            };

            // Write updated JSON back to file
            fs.writeFile( authFilePath, JSON.stringify( users, null, 4 ), 'utf8', (err) => {
                if ( err ) {
                    console.error( 'Error writing file:', err );
                } else {
                    console.log( `New user "${username}" added successfully.` );
                }
            });

            // Return user authentication error
            return res.json({ created: true });

        } else {
            return res.json({ created: false });
        }

    } catch ( err ) {
        console.error( 'Error reading the directory:', err );
        res.status( 500 ).json({ error: 'Unable to read directory' });
    }

});

/**
 * GET /api/user/delete
 * Endpoint to delete user.
 * This will return a success/error message.
 */
app.post( '/api/user/delete', async (req, res) => {

    // Set param and query variables
    const { username } = req.body;
  
    try {

        // If the file doesn't exist, skip read
        if( !fs.existsSync( authFilePath ) ) {
            res.status( 500 ).json({ error: 'Unable to read directory' });
        }

        // If the file exists, read and parse the data
        const userData = await fs.promises.readFile( authFilePath, 'utf-8' );
        const users = JSON.parse( userData );

        // Check if user exists
        if ( users[username] ) {

            // Delete user
            delete users[username];

            // Write updated JSON back to file
            fs.writeFile( authFilePath, JSON.stringify( users, null, 4 ), 'utf8', (err) => {
                if ( err ) {
                    console.error( 'Error writing file:', err );
                } else {
                    console.log( `User "${username}" deleted successfully.` );
                }
            });

            // Return user authentication error
            return res.json({ deleted: true });

        } else {
            return res.json({ deleted: false });
        }

    } catch ( err ) {
        console.error( 'Error reading the directory:', err );
        res.status( 500 ).json({ error: 'Unable to read directory' });
    }

});

/**
 * GET /api/user/create
 * Endpoint to create new user.
 * This will return a success/error message.
 */
app.get( '/api/user/list', async (req, res) => {
  
    try {

        // If the file doesn't exist, skip read
        if( !fs.existsSync( authFilePath ) ) {
            res.status( 500 ).json({ error: 'Unable to read directory' });
        }

        // If the file exists, read and parse the data
        const userData = await fs.promises.readFile( authFilePath, 'utf-8' );
        const users = JSON.parse( userData );

        return res.json( users );

    } catch ( err ) {
        console.error( 'Error reading the directory:', err );
        res.status( 500 ).json({ error: 'Unable to read directory' });
    }

});

/**
 * GET /api/user/update-password
 * Endpoint to update user password.
 * This will return a success/error message.
 */
app.post( '/api/user/update-password', async (req, res) => {

    // Set param and query variables
    const { username, password } = req.body;
  
    try {

        // If the file doesn't exist, skip read
        if( !fs.existsSync( authFilePath ) ) {
            res.status( 500 ).json({ error: 'Unable to read directory' });
        }

        // If the file exists, read and parse the data
        const userData = await fs.promises.readFile( authFilePath, 'utf-8' );
        const users = JSON.parse( userData );

        // Hash password
        const hashedPassword = await hashPassword( password );

        // Add new user
        users[username].password = hashedPassword;

        // Write updated JSON back to file
        fs.writeFile( authFilePath, JSON.stringify( users, null, 4 ), 'utf8', (err) => {
            if ( err ) {
                console.error( 'Error writing file:', err );
            } else {
                console.log( `New user "${username}" added successfully.` );
            }
        });

        // Return user authentication error
        return res.json({ updated: true });

    } catch ( err ) {
        console.error( 'Error reading the directory:', err );
        res.status( 500 ).json({ error: 'Unable to read directory' });
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