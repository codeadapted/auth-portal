import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Login/AuthContext';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';

/**
 * HomePage Component
 * 
 * Represents the main landing page of the application.
 * Displays the Portal Home component.
 */
const HomePage = () => {

    // Get AuthContext
    const { logout, isAdmin } = useAuth();

    // Get navigation object
    const navigate = useNavigate();

    // Render the component
    return (
        <div className="home-page">
            <div className="inner-wrapper">
                
                <div className="logo">
                    <Logo />
                    <h2>Home</h2>
                </div>

                <div>Hello World!</div>

                {/* Bottom Buttons */}
                <div className="bottom-buttons">
                    {isAdmin && (
                        <div className="admin-home-btn btn" onClick={() => navigate( '/admin' )}>Admin Home</div>
                    )}
                    <div className="logout-button btn" onClick={() => logout()}>Logout</div>
                </div>

            </div>
        </div>
    );
};

export default HomePage;