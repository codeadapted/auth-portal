// Required modules
const fs = require( 'fs' );
const { hashPassword } = require( '../utils/passwordUtils' );
const { authFilePath } = require( '../utils/authUtils' );

exports.createUser = async (req, res) => {

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

};

exports.deleteUser = async (req, res) => {

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

};

exports.getUserList = async (req, res) => {
  
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

};

exports.updateUserPassword = async (req, res) => {

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

};