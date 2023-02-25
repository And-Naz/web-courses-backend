const router = require('express').Router()
const UserController = require('../controllers/userController')
// const AuthMiddleware = require('../middlewares/authMiddleware')
// const { body } = require('express-validator')

// /api/auth/registration
router.post('/registration',
	// body('email').isEmail(),
	// body('password').isString().isLength({ min: 6, max: 32 }),
	UserController.registration
);

// /api/auth/login
router.post('/login', UserController.login);

// /api/auth/logout
router.post('/logout', UserController.logout);

// /api/auth/activate/:link
router.get('/activate/:link', UserController.activate);

// /api/auth/refresh
router.get('/refresh', UserController.refresh);

// /api/auth/users
// router.get('/users', AuthMiddleware, UserController.getUsers);

module.exports = router