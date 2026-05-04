const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/authMiddleware');
const { userRegistrationValidation, userUpdateValidation, validate } = require('../utils/validators');

// Public routes
router.post('/register', userRegistrationValidation, validate, UserController.register);
router.post('/login', UserController.login);

// Protected routes 
router.put('/update', authenticateToken, userUpdateValidation, validate, UserController.updateProfile);
router.get('/history', authenticateToken, UserController.getTransactionHistory);
router.get('/total-spent', authenticateToken, UserController.getTotalSpent);
router.post('/top-up', authenticateToken, UserController.topUpBalance);

// Dynamic route MUST be at the bottom to avoid catching static routes like /history
router.get('/:email', authenticateToken, UserController.getUserByEmail);

module.exports = router;