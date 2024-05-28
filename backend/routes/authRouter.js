const {Router} = require('express');

const {AuthController} = require('../controllers/authController');

const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/register', AuthController.register);

module.exports = {authRouter}
