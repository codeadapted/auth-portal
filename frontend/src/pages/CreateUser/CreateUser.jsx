import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../utils/dashboardUtils';
import { useAuth } from '../../components/Login/AuthContext';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';

const CreateUser = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState( '' );
    const [password, setPassword] = useState( '' );
    const [selectedRole, setSelectedRole] = useState( '' );
    const [error, setError] = useState( false );
    const [success, setSuccess] = useState( false );

    // Handle the role selection
    const handleRoleChange = ( event ) => {

        // Set the selected table and reset the records
        const role = event.target.value;
        setSelectedRole( role );

    };

    const handleSubmit = async (e) => {

        // Prevent default functionality
        e.preventDefault();

        try {

            // Create user
            const create = await createUser( username, password, selectedRole );

            if( create.created ) {
                setError( false );
                setSuccess( true );
                setUsername( '' );
                setPassword( '' );
                setSelectedRole( '' );
                setTimeout(() => {
                    setSuccess( false );
                }, 3000);
            } else {
                setError( true );
                setSuccess( false );
            }

        } catch ( error ) {
            console.error( 'Error creating user:', error );
        }

    };

    return (
        <div className="create-user-form">
            <div className="center-text">
                <div className="inner-wrapper">
                    <form onSubmit={handleSubmit}>
                        <div className="logo">
                            <Logo />
                            <h2>User<br/>Creation</h2>
                        </div>
                        <div className="form-wrapper">
                            <h3>Enter the credentials for the new user.</h3>
                            {error && (
                                <h3 className="error">Username already taken.</h3>
                            )}
                            {success && (
                                <h3 className="success">User created successfully.</h3>
                            )}
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername( e.target.value )}
                            />
                            <select
                            className="cell"
                            value={selectedRole}
                            onChange={handleRoleChange}
                            >
                                <option value="">Select a Role</option>
                                <option value="default">Default</option>
                                <option value="admin">Admin</option>
                            </select>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword( e.target.value )}
                            />
                            <button className="create-user-btn btn" type="submit">Create User</button>
                        </div>
                    </form>
                </div>

                {/* Bottom Buttons */}
                <div className="bottom-buttons">
                    <div className="admin-home-btn btn" onClick={() => navigate( '/' )}>Admin Home</div>
                    <div className="logout-button btn" onClick={() => logout()}>Logout</div>
                </div>

            </div>
        </div>
    );

};

export default CreateUser;