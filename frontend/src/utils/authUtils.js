// Required modules
require( 'dotenv' ).config();

// Define the API URL, allowing for environment-specific flexibility
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Send authentication request to API endpoint.
 * @param {string} username - The inputted username.
 * @param {string} password - The inputted password.
 * @returns {Boolean} Authentication request result.
 * @throws {Error} Throws an error if the HTTP request fails.
 */
export const authenticateUser = async ( username, password ) => {

    try {

        // Authentication request
        const response = await fetch( `${API_URL}/auth/user`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
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

/**
 * Verify authentication token with API endpoint.
 * @returns {Object} Authentication request result.
 * @throws {Error} Throws an error if the HTTP request fails.
 */
export const verifyToken = async () => {

    // Get authentication token from sessionStorage
    const token = sessionStorage.getItem( 'authToken' );

    // Send request to endpoint
    const response = await fetch( `${API_URL}/auth/verify-token`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        },
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
 * Verify user role with API endpoint.
 * @returns {Object} Request result.
 * @throws {Error} Throws an error if the HTTP request fails.
 */
export const verifyRole = async () => {

    // Get username from sessionStorage
    const username = sessionStorage.getItem( 'username' );

    // Send request to endpoint
    const response = await fetch( `${API_URL}/auth/verify-role?username=${username}` );

    // Check if the response is successful
    if ( !response.ok ) {
        throw new Error( `HTTP error! status: ${response.status}` );
    }

    // Parse the JSON response
    const result = await response.json();

    // Return fetched data
    return result;

};