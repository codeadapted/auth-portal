import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Login/AuthContext';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';

/**
 * HomePage Component
 * 
 * Represents the main landing page of the application.
 * Displays the Enrichment Initiator component.
 */
const HomePage = () => {
    const { logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    return (
        <div className="home-page">
            <div className="buttons">

                <div className="logo">
                    <Logo />
                    <h2>Admin<br/>Home</h2>
                </div>

                { isAdmin && (
                    <div className="create-user-btn" onClick={() => navigate( '/create-user' )}>Create New User</div>
                ) }
                { isAdmin && (
                    <div className="user-manager-btn" onClick={() => navigate( '/user-manager' )}>Manage Users</div>
                ) }

                {/* Logout button */}
                <div className="logout-button" onClick={() => logout()}>Logout</div>
            </div>
        </div>
    );
};

export default HomePage;