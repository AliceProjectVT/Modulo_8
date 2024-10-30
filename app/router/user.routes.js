const { Router } = require('express');
const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/auth');
const { checkDuplicateEmail } = require('../middleware/index.js');
const router = Router();

router
    .post('/signup', checkDuplicateEmail, userController.createUser)
    .post('/signin', userController.signIn)
    .get('/users', verifyToken, userController.findAll) 
    .get('/users/:id', verifyToken, userController.findUserById) 
    .put('/users/:id', verifyToken, userController.updateUserById) 
    .delete('/users/:id', verifyToken, userController.deleteUserById) 

module.exports = router;