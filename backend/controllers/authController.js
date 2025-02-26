// Required modules
const jwt = require( 'jsonwebtoken' );
const fs = require( 'fs' );
const path = require( 'path' );
const bcrypt = require( 'bcrypt' );
const { hashPassword } = require( '../utils/passwordUtils' );
const { authFilePath } = require( '../utils/authUtils' );

// JSON Web Token secret
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateUser = async (req, res) => {

    // Set param and query variables
    const { username, password } = req.body;

    // Path to the enrichment counts JSON file
    const usersAuthPath = path.join( __dirname, '../data/authentication.json' );
    
    try {

        // If the file doesn't exist, skip read
        if( !fs.existsSync( usersAuthPath ) ) {
            return res.status( 500 ).json({ error: 'Authentication file not found' });
        }

        // If the file exists, read and parse the data
        const authData = await fs.promises.readFile( usersAuthPath, 'utf-8' );
        const auth = JSON.parse( authData );

        // Check if user exists and password matches
        if ( auth[username] ) {

            // Hash password
            const hashedPassword = await hashPassword( password );

            // Store hash password
            const storedHashedPassword = auth[username]?.password;

            // Compare using bcrypt if password is hashed (recommended)
            const passwordMatch = await bcrypt.compare( password, storedHashedPassword );

            if ( passwordMatch ) {

                // Generate a JWT token
                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        
                // Return user authentication success along with the token
                return res.json({ authenticated: true, token });

            }

        }

        // Return user authentication error
        return res.status( 401 ).json({ error: 'Invalid username or password' });

    } catch ( err ) {
        console.error( 'Authentication Error:', err );
        res.status( 500 ).json({ error: 'Authentication Error' });
    }

};

exports.verifyToken = (req, res) => {

    // Get the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting format: "Bearer <token>"

    // Check if token exists
    if ( !token ) {
        return res.status( 401 ).json({ error: 'Access denied' });
    }

    try {

        // Verify token
        jwt.verify( token, JWT_SECRET );
        return res.status( 200 ).json({ valid: true });

    } catch ( err ) {
        return res.status( 401 ).json({ error: 'Invalid or expired token' });
    }

};

exports.verifyRole = async (req, res) => {

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

};