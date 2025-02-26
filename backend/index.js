

// Required modules
require( 'dotenv' ).config();
const express = require( 'express' );
const cors = require( 'cors' );
const cookieParser = require( 'cookie-parser' );
const path = require( 'path' );
const { authFileCheck } = require( './utils/authUtils' );

// Required routes
const authRoutes = require( './routes/authRoutes' );
const adminRoutes = require( './routes/adminRoutes' );

// Setup express app
const app = express();
const PORT = process.env.PORT || 8000;
const HOST = process.env.PROXY || '127.0.0.1';

// Middleware to enable CORS and parse JSON request bodies
app.use( cors() );
app.use( express.json() );
app.use( cookieParser() );

// Run auth file check
authFileCheck();

// Routes
app.use( '/api/auth', authRoutes );
app.use( '/api/admin', adminRoutes );

// Serve static files from the React frontend app
app.use( express.static( path.join( __dirname, '../frontend/build' ) ) );

// Catch-all handler: for any request that doesn't match above, send back React's index.html file.
app.get( '*', ( req, res ) => {
  res.sendFile( path.join( __dirname, '../frontend/build', 'index.html' ) );
});

// Start server
app.listen( PORT, HOST, () => console.log( `Server is running at ${HOST}:${PORT}` ) );