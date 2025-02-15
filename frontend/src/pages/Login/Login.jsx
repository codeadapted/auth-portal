import React, { useState } from "react";
import { useAuth } from '../../components/Login/AuthContext';
import { authenticateUser } from '../../utils/dashboardUtils';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';

const Login = () => {

    // State variables
    const [username, setUsername] = useState( '' );
    const [password, setPassword] = useState( '' );
    const [error, setError] = useState( false );

    // Get AuthContext
    const { login } = useAuth();

    // Handle form submission
    const handleSubmit = async ( e ) => {

        // Prevent default functionality
        e.preventDefault();

        try {

        // Run authentication
        const response = await authenticateUser( username, password );

        // Check if user authenticated successfully
        if ( response.authenticated ) {

            // Reset error state
            setError( false );

            // Store token using the login function from AuthContext
            await login( response.token, username );

        } else {

            // Set error state
            setError( true );

        }

        } catch ( error ) {
            console.error( 'Login error:', error );
        }

    };   

    // Return the login form
    return (
        <div className="login-form">
        <div className="center-text">
            <div className="inner-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="logo">
                        <Logo />
                        <h2>Auth<br/>Portal</h2>
                    </div>
                    <div className="login-wrapper">
                        <h3>Enter your login credentials below.</h3>
                        {error && (
                            <h3 className="error">Invalid username or password.</h3>
                        )}
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername( e.target.value )}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword( e.target.value )}
                        />
                        <button className="login-btn btn" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );

};

export default Login;