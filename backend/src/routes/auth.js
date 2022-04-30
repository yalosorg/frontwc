const router = require('express').Router();

const controller = require('../controllers/auth.js'); 

// POST /auth/login
router.post('/login', controller.login);

// POST auth/register
router.post('/register', controller.register);

module.exports = router;