import React, { createContext, useState, useContext, useEffect } from "react";
import { verifyToken, verifyRole } from '../../utils/dashboardUtils';

// Create the authentication context
const AuthContext = createContext();

// Provider to wrap the app, providing authentication-related functionality
export const AuthProvider = ({ children }) => {

    // Authentication state, initialized as null to represent loading state
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    // If the user is an admin, give admin access
    const checkRole = async () => {

        try {

            // Call the verifyRole utility
            const check = await verifyRole();

            // Check if the user is an admin
            if ( check.role === 'admin' ) {
                setIsAdmin( true );
            } else {
                setIsAdmin( false );
            }

        } catch ( error ) {

            // Log error
            console.log( error );
    
            // If an error occurs during the fetch request, set the admin state to false
            setIsAdmin( false );
        
        }

    };

    // Check authentication status when the provider mounts
    useEffect(() => {

        // If the user is authenticated, verify the token with the server
        const checkToken = async () => {

            // Check if the token exists in session storage to set authentication state
            const token = sessionStorage.getItem( 'authToken' );

            if ( token ) {

                try {

                    // Call the verifyToken utility
                    await verifyToken();
                    setIsAuthenticated( true );
        
                } catch ( error ) {

                    // Log error
                    console.log( error );
        
                    // If the token is invalid, log out the user
                    logout();
            
                    // If an error occurs during the fetch request, set the authentication state to false
                    setIsAuthenticated( false );
                
                }

            } else {
                setIsAuthenticated( false );
            }
    
        };
    
        // Call the checkToken function to verify the user's authentication status
        checkToken();
        checkRole();

    }, []);
    
    const login = async ( token, username ) => {

        // Store the token and username in session storage
        sessionStorage.setItem( 'authToken', token );
        sessionStorage.setItem( 'username', username );
        setIsAuthenticated( true );
        checkRole();

    };
    
    const logout = () => {

        // Remove the token and username from session storage
        sessionStorage.removeItem( 'authToken' );
        sessionStorage.removeItem( 'username' );
        setIsAuthenticated( false );
        setIsAdmin( false );

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

};

// Hook for accessing the authentication context
export const useAuth = () => useContext( AuthContext );