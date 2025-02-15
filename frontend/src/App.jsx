import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './components/Login/AuthContext';
import CreateUser from './pages/CreateUser/CreateUser';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import PortalHome from './pages/PortalHome/PortalHome';
import UserManager from './pages/UserManager/UserManager';

// Higher-Order Component for Protected Routes
const ProtectedRoute = ({ element, requiresAuth, requiresAdmin }) => {

	// Get authentication state
    const { isAuthenticated, isAdmin } = useAuth();

	// Redirect based on authentication status
    if ( requiresAuth && !isAuthenticated ) return <Navigate to="/login" />;
    if ( requiresAdmin && !isAdmin ) return <Navigate to="/" />;
    
    return element;
};

const App = () => {

	// Get authentication state
	const { isAuthenticated, isAdmin } = useAuth();

	// If the authentication status is still being determined, show a loading message
	if ( isAuthenticated === null && isAdmin === null ) {
		return <div>Loading...</div>;
	}
  
	return (
		<>
			<div className={isAuthenticated ? 'app-container' : 'app-container login'}>
				<Routes>

					{/* Home Page - accessible to everyone */}
					<Route path="/" element={isAuthenticated ? <HomePage /> : <Login />} />

					{/* Login Page - accessible only to unauthenticated users */}
					<Route 
						path="/login" 
						element={!isAuthenticated ? <Login /> : <Navigate to={isAdmin ? '/admin' : '/'} />}
                	/>

					{/* Admin Portal Page - accessible only to admin users */}
					<Route 
						path="/admin"
						element={<ProtectedRoute element={<PortalHome />} requiresAuth requiresAdmin />} 
					/>

					{/* Create User Page - accessible only to admin users */}
					<Route 
						path="/create-user" 
						element={<ProtectedRoute element={<CreateUser />} requiresAuth requiresAdmin />} 
					/>

					{/* User Manager Page - accessible only to admin users */}
					<Route 
						path="/user-manager" 
						element={<ProtectedRoute element={<UserManager />} requiresAuth requiresAdmin />} 
					/>
		
					{/* Catch-All - handles all other routes, rendering a 404 page */}
					<Route path="*" element={<NotFoundPage />} />

				</Routes>
			</div>
		</>
	);	
};

export default App;
