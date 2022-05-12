const router = require('express').Router();
const passport = require('passport');

const controller = require('../controllers/user.js'); 

router.get('/user/:id', passport.authenticate('jwt', { session: false }), controller.getUser);

router.get('/me', passport.authenticate('jwt', { session: false }), controller.getUserMe);

module.exports = router;