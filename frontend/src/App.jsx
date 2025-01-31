import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './components/Login/AuthContext';
import HomePage from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

const App = () => {

	// Get authentication state
	const { isAuthenticated } = useAuth();

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
		
					{/* Catch-All - handles all other routes, rendering a 404 page */}
					<Route path="*" element={<NotFoundPage />} />

				</Routes>
			</div>
		</>
	);	
};

export default App;
