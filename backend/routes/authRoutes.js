const express = require( 'express' );
const { authenticateUser, verifyToken, verifyRole } = require( '../controllers/authController' );
const router = express.Router();

/**
 * POST /api/auth/user
 * Endpoint to authenticate user.
 * This will return a boolean (true/false) depending on login credentials.
 */
router.post( '/user', authenticateUser );

/**
 * GET /api/auth/verify-token
 * Endpoint to validate auth token.
 * This will return a success/error message.
 */
router.get( '/verify-token', verifyToken );

/**
 * GET /api/auth/verify-role
 * Endpoint to check user role.
 * This will return a success/error message.
 */
router.get( '/verify-role', verifyRole );


// Export module
module.exports = router;