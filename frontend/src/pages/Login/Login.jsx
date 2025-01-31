import React, { useState } from "react";
import { useAuth } from '../../components/Login/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../../utils/dashboardUtils';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';
import { ReactComponent as RightArrow } from '../../assets/img/arrow-right.svg';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    // Prevent default functionality
    e.preventDefault();

    try {

      // Run authentication
      const response = await authenticateUser( username, password );

      // Check if user authenticated successfully
      if ( response.authenticated ) {

        // Store token using the login function from AuthContext
        login( response.token );
        navigate( '/' ); // Redirect after successful login

      } else {
        alert( 'Invalid username or password' );
      }

    } catch ( error ) {
      console.error( 'Login error:', error );
    }

  };

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
              <button type="submit">Login<RightArrow /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

export default Login;