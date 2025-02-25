const express = require( 'express' );
const { verifyRole, createUser, deleteUser, getUserList, updateUserPassword } = require( '../controllers/adminController' );
const router = express.Router();

/**
 * POST /api/admin/user/create
 * Endpoint to create new user.
 * This will return a success/error message.
 */
router.post( '/user/create', createUser );

/**
 * POST /api/admin/user/delete
 * Endpoint to delete user.
 * This will return a success/error message.
 */
router.post( '/user/delete', deleteUser );

/**
 * GET /api/admin/user/list
 * Endpoint to create new user.
 * This will return a success/error message.
 */
router.get( '/user/list', getUserList );

/**
 * POST /api/admin/user/update-password
 * Endpoint to update user password.
 * This will return a success/error message.
 */
router.post( '/user/update-password', updateUserPassword );


// Export module
module.exports = router;