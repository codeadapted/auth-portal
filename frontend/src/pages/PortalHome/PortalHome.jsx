import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Login/AuthContext';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';

/**
 * PortalHome Component
 * 
 * Represents the main landing page of the application.
 * Displays the Portal Home component.
 */
const PortalHome = () => {

    // Get AuthContext
    const { logout } = useAuth();

    // Get navigation object
    const navigate = useNavigate();

    // Render the component
    return (
        <div className="portal-home-page">
            <div className="buttons">
                
                <div className="logo">
                    <Logo />
                    <h2>Admin<br />Home</h2>
                </div>

                <div className="create-user-btn btn" onClick={() => navigate( '/create-user' )}>Create New User</div>
                <div className="user-manager-btn btn" onClick={() => navigate( '/user-manager' )}>Manage Users</div>
                <div className="home-btn btn" onClick={() => navigate( '/' )}>Visit Home Page</div>

                {/* Logout button */}
                <div className="logout-button btn" onClick={() => logout()}>Logout</div>

            </div>
        </div>
    );
};

export default PortalHome;