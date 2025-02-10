import React from 'react';
import { useAuth } from '../../components/Login/AuthContext';

/**
 * HomePage Component
 * 
 * Represents the main landing page of the application.
 * Displays the Enrichment Initiator component.
 */
const HomePage = () => {
    const { logout } = useAuth();
    return (
        <div className="home-page">

            {/* Logout button */}
            <div className="logout-button" onClick={() => logout()}>Logout</div>
        
        </div>
    );
};

export default HomePage;
