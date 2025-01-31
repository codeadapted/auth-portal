import React, { createContext, useState, useContext, useEffect } from "react";
import { verifyToken } from '../../utils/dashboardUtils';

// Create the authentication context
const AuthContext = createContext();

// Provider to wrap the app, providing authentication-related functionality
export const AuthProvider = ({ children }) => {

    // Authentication state, initialized as null to represent loading state
    const [isAuthenticated, setIsAuthenticated] = useState(null);

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

    }, []);
    
    const login = ( token ) => {

        // Store the token in session storage
        sessionStorage.setItem( 'authToken', token );
        setIsAuthenticated( true );

    };
    
    const logout = () => {

        // Remove the token from session storage
        sessionStorage.removeItem( 'authToken' );
        setIsAuthenticated( false );

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

};

// Hook for accessing the authentication context
export const useAuth = () => useContext( AuthContext );