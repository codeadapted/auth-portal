import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './components/Login/AuthContext';
import CreateUser from './pages/CreateUser/CreateUser';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import UserManager from './pages/UserManager/UserManager';

const App = () => {

	// Get authentication state
	const { isAuthenticated, isAdmin } = useAuth();

	// If the authentication status is still being determined, show a loading message
	if ( isAuthenticated === null ) {
		return <div>Loading...</div>;
	}
  
	return (
		<>
			<div className={isAuthenticated ? 'app-container' : 'app-container login'}>
				<Routes>

					{/* Home Page - accessible to everyone */}
					<Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />

					{/* Login Page - accessible only to unauthenticated users */}
					<Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

					{/* Create User Page - accessible only to admin users */}
					<Route path="/create-user" element={isAuthenticated && isAdmin ? <CreateUser /> : <Login />} />

					{/* User Manager Page - accessible only to admin users */}
					<Route path="/user-manager" element={isAuthenticated && isAdmin ? <UserManager /> : <Login />} />
		
					{/* Catch-All - handles all other routes, rendering a 404 page */}
					<Route path="*" element={<NotFoundPage />} />

				</Routes>
			</div>
		</>
	);	
};

export default App;
