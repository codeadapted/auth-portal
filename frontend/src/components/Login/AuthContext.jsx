import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { verifyToken, verifyRole } from '../../utils/dashboardUtils';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
const AuthContext = createContext();

// Provider to wrap the app, providing authentication-related functionality
export const AuthProvider = ({ children }) => {

    // Authentication state, initialized as null to represent loading state
    const [isAuthenticated, setIsAuthenticated] = useState( null );
    const [isAdmin, setIsAdmin] = useState( null );

    // Get navigation object
    const navigate = useNavigate();

    // Logout function
    const logout = useCallback( () => {

        // Remove the token and username from session storage
        sessionStorage.removeItem( 'authToken' );
        sessionStorage.removeItem( 'username' );
        setIsAuthenticated( false );
        setIsAdmin( false );

    }, [] );

    // If the user is authenticated, verify the token with the server
    const checkToken = useCallback( async () => {

        // Check if the token exists in session storage to set authentication state
        const token = sessionStorage.getItem( 'authToken' );

        // If a token is found, verify it
        if ( token ) {

            try {

                // Call the verifyToken utility
                await verifyToken();
                setIsAuthenticated( true );
    
            } catch ( error ) {

                // Log error
                console.log( 'Token verification failed:', error );
    
                // If the token is invalid, log out the user
                logout();
        
                // If an error occurs during the fetch request, set the authentication state to false
                setIsAuthenticated( false );
            
            }

        } else {
            setIsAuthenticated( false );
        }

    }, [logout] );

    // If the user is an admin, give admin access
    const checkRole = useCallback( async () => {

        try {

            // Get username from sessionStorage
            const username = sessionStorage.getItem( 'username' );

            // If no username is found, log a warning
            if ( !username ) return;

            // Call the verifyRole utility
            const check = await verifyRole();

            // Check if the user is an admin
            setIsAdmin( check.role === 'admin' );

            // If the user is an admin,
            return check.role;

        } catch ( error ) {

            // Log error
            console.log( 'Role verification failed:', error );
    
            // If an error occurs during the fetch request, set the admin state to false
            setIsAdmin( false );
        
        }

    }, [] );

    // Check authentication status when the provider mounts
    useEffect(() => {

        // Call the initial checkToken and checkRole functions
        checkToken();
        checkRole();
    
        // Call the checkToken and checkRole functions to verify the user's authentication status every 10 seconds
        const interval = setInterval(() => {
            checkToken();
            checkRole();
        }, 10000);
    
        return () => clearInterval( interval );

    }, [checkToken, checkRole] );

    // Login function
    const login = async ( token, username ) => {

        // Store the token and username in session storage
        sessionStorage.setItem( 'authToken', token );
        sessionStorage.setItem( 'username', username );
        
        // Check if the user is an admin
        const role = await checkRole();

        if ( role === 'admin' ) {
            navigate( '/admin' );
        }

        // Set the authentication state to true
        setIsAuthenticated( true );

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

};

// Hook for accessing the authentication context
export const useAuth = () => useContext( AuthContext );