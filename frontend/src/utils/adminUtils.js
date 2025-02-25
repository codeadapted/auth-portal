/**
 * Create new user.
 * @returns {Object} Request result.
 * @throws {Error} Throws an error if the HTTP request fails.
 */
export const createUser = async ( username, password, role ) => {

    // Define the API URL, allowing for environment-specific flexibility
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

    // Authentication request
    const response = await fetch( `${API_URL}api/admin/user/create`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role })
    });
    
    // Check if the response is successful
    if ( !response.ok ) {
        throw new Error( `HTTP error! status: ${response.status}` );
    }

    // Parse the JSON response
    const result = await response.json();

    // Return fetched data
    return result;

};

/**
 * Delete user.
 * @returns {Object} Request result.
 * @throws {Error} Throws an error if the HTTP request fails.
 */
export const deleteUser = async ( username ) => {

    // Define the API URL, allowing for environment-specific flexibility
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

    try {

        // Authentication request
        const response = await fetch( `${API_URL}api/admin/user/delete`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username })
        });
        
        // Check if the response is successful
        if ( !response.ok ) {
            throw new Error( `HTTP error! status: ${response.status}` );
        }

        // Parse the JSON response
        const result = await response.json();

        // Return fetched data
        return result;
        
    } catch ( error ) {
        console.log( 'Error creating user: ', error );
        return { created: false };
    }

};

/**
* Change user password.
* @returns {Boolean} Authentication request result.
* @throws {Error} Throws an error if the HTTP request fails.
*/
export const getUserList = async () => {

   // Define the API URL, allowing for environment-specific flexibility
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

   try {

        // Authentication request
        const response = await fetch( `${API_URL}api/admin/user/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        // Check if the response is successful
        if ( !response.ok ) {
            throw new Error( `HTTP error! status: ${response.status}` );
        }

        // Parse the JSON response
        const result = await response.json();

        // Return fetched data
        return result;
       
   } catch ( error ) {
        console.log( 'Error authenticating user: ', error );
        return { authenticated: false };
   }

};

/**
* Change user password.
* @param {string} username - The inputted username.
* @param {string} password - The inputted password.
* @returns {Boolean} Authentication request result.
* @throws {Error} Throws an error if the HTTP request fails.
*/
export const changeUserPassword = async ( username, password ) => {

    // Define the API URL, allowing for environment-specific flexibility
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';
 
    try {
 
        // Authentication request
        const response = await fetch( `${API_URL}api/admin/user/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        // Check if the response is successful
        if ( !response.ok ) {
            throw new Error( `HTTP error! status: ${response.status}` );
        }
 
        // Parse the JSON response
        const result = await response.json();
 
        // Return fetched data
        return result;
        
    } catch ( error ) {
        console.log( 'Error authenticating user: ', error );
        return { authenticated: false };
    }
 
};