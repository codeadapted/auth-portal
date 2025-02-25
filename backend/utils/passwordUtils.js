// Required modules
const bcrypt = require( 'bcrypt' );

/**
* Create secure hashed password for user inputted password
*
* @param  {String} password User inputted password
* @return {String} hashed password
*/
exports.hashPassword = async ( password ) => await bcrypt.hash( password, 10 );