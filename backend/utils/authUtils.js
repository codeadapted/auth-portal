// Required modules
const path = require( 'path' );
const fs = require( 'fs' );

/**
 * Function to check if the authentication.json file exists.
 * If it doesn't, create it from default.authentication.json.
 * This function is called when the server
 * starts up in backend/index.js.
*/
exports.authFileCheck = async () => {

    // Path to the enrichment counts JSON file
    const authFilePath = path.join(__dirname, '../data/authentication.json');
    const defaultAuthFilePath = path.join(__dirname, '../data/default.authentication.json');
    
    // Check if authentication.json exists, if not, create it from default.authentication.json
    if ( !fs.existsSync( authFilePath ) ) {
        if ( fs.existsSync( defaultAuthFilePath ) ) {
            fs.copyFileSync( defaultAuthFilePath, authFilePath );
            console.log( 'The authentication.json file was missing and has been created from default.authentication.json' );
        } else {
            console.error( 'Error: default.authentication.json does not exist. Cannot create authentication.json' );
        }
    }
 
};

exports.authFilePath = path.join( __dirname, '../data/authentication.json' );