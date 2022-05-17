const router = require('express').Router();
const passport = require('passport');

const controller = require('../controllers/user.js'); 

router.get('/user/:id', passport.authenticate('jwt', { session: false }), controller.getUser);

router.get('/me', passport.authenticate('jwt', { session: false }), controller.getUserMe);

// handle, create payment link(crystalpay)
//https://crystalpay.ru/docs/API-docs.html
router.post('/genlink', passport.authenticate('jwt', { session: false }), controller.genlink);

router.post('/payment/:id', controller.payment);


module.exports = router;