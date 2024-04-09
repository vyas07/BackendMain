const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes for CRUD operations
router.post('/signup', userController.signup);
router.get('/fetchAll', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/loginUser', userController.getUserByRoleEmailAndPassword);
router.post('/forgotPassword', userController.forgotPassword);

module.exports = router;
