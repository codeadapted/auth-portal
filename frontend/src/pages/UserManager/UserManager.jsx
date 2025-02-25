import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getUserList, changeUserPassword, deleteUser } from '../../utils/adminUtils';
import { useAuth } from '../../components/Login/AuthContext';
import { ReactComponent as Logo } from '../../assets/img/logo.svg';

const UserManager = () => {

    // Get AuthContext
    const { logout } = useAuth();

    // Get navigation object
    const navigate = useNavigate();

    // State variables
    const [usernameUpdate, setUsernameUpdate] = useState( '' );
    const [password, setPassword] = useState( '' );
    const [users, setUsers] = useState( [] );
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState( null );
    const [success, setSuccess] = useState( null );
    const [deleteSuccess, setDeleteSuccess] = useState( null );
    const [deleteConfirmation, setDeleteConfirmation] = useState( null );

    // Load users
    useEffect(() => {
        getUserList()
            .then( setUsers )
            .catch( err => setError( 'Failed to load users' ) )
            .finally( () => setLoading( false ) );
    }, []);

    // Handle the update password click
    const handleUpdatePasswordClick = async ( username ) => {
        setUsernameUpdate( username );
        setPassword( '' );
    };

    // Handle the password update
    const handlePasswordUpdate = async ( e, username ) => {
        
        // Prevent default functionality
        e.preventDefault();

        try {

            // Update password
            const update = await changeUserPassword( username, password );

            if( update.updated ) {
                setPassword( '' );
                setSuccess( username );
                setTimeout( () => {
                    setSuccess( null );
                }, 2000 );
            }

        } catch ( error ) {
            console.error( 'Error updating password:', error );
        }

    };

    // Handle the delete user
    const handleDeleteUser = async ( username, confirmation = false ) => {

        if( deleteConfirmation === username && !confirmation ) return setDeleteConfirmation( null );

        if( !confirmation ) return setDeleteConfirmation( username );

        try {
            await deleteUser( username );
            setDeleteConfirmation( null );
            setDeleteSuccess( username );
            setTimeout(() => { 
                setDeleteSuccess( null );
                setUsers( users => {    
                    const newUsers = { ...users };
                    delete newUsers[username];
                    return newUsers;
                });
            }, 2000 );
        } catch (error) {
            console.error( 'Error deleting user:', error );
        }

    };

    // R3cr1Tr2025

    // Render the component
    return (
        <div className="user-manager">
            <div className="inner-wrapper">
                <div className="logo">
                    <Logo />
                    <h2>User<br/>Manager</h2>
                </div>

                {loading && <p>Loading users...</p>}
                {error && <p>{error}</p>}

                <div className="user-list">
                    { Object.entries( users ).map( (user, index) => (
                        <div key={index} className="user">
                            <div className="user-details">
                                <div className="username"><strong>Username:</strong> {user[0]}</div>
                                <div className="role"><strong>Role:</strong> {user[1].role}</div>
                            </div>
                            <div className="user-actions">
                                { user[0] !== 'admin' && ( <button className="delete-button btn" onClick={() => handleDeleteUser( user[0] )}>Delete</button> ) }
                                <button className="update-password-button btn" onClick={() => handleUpdatePasswordClick( user[0] )}>Update Password</button>
                            </div>
                            { deleteConfirmation === user[0] && (
                                <div className="delete-confirmation-wrapper"> 
                                    <div className="delete-confirmation">Are you sure you would like to delete this user?</div>
                                    <div className="delete-confirmation-buttons">  
                                        <button className="confirm-delete btn" onClick={() => handleDeleteUser( user[0], true )}>Yes</button>
                                        <button className="cancel-delete btn" onClick={() => setDeleteConfirmation( null )}>No</button>
                                    </div>
                                </div>
                            )}
                            { usernameUpdate === user[0] && (
                                <div className="update-password-form">
                                    <form onSubmit={(e) => handlePasswordUpdate( e, user[0] )}>
                                        <input 
                                            type="text" 
                                            placeholder="New Password" 
                                            value={password} 
                                            onChange={(e) => setPassword( e.target.value )} 
                                        />
                                        <button className="update-btn btn" type="submit">Update</button>
                                    </form>
                                </div>
                            )}
                            { success === user[0] && (
                                <div className="password-update-success success">Password updated successfully!</div>
                            )}
                            { deleteSuccess === user[0] && (
                                <div className="delete-success success">User deleted successfully!</div>
                            )}
                        </div>
                    )) }   
                </div>
            </div>

            {/* Bottom Buttons */}
            <div className="bottom-buttons">
                <div className="admin-home-btn btn" onClick={() => navigate( '/admin' )}>Admin Home</div>
                <div className="logout-button btn" onClick={() => logout()}>Logout</div>
            </div>

        </div>
    );

};

export default UserManager;