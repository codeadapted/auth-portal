import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import App from './App';
import { AuthProvider } from './components/Login/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);