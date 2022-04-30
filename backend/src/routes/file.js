const router = require('express').Router();
const passport = require('passport');

const controller = require('../controllers/file.js'); 

router.get('/getmyresources', passport.authenticate('jwt', { session: false }), controller.getMyResources);
router.get('/sharedresources', passport.authenticate('jwt', { session: false }), controller.sharedResources);
router.post('/download', passport.authenticate('jwt', { session: false }), controller.download);
// router.post()
router.post('/upload-end', passport.authenticate('jwt', { session: false }), controller.uploadFileEnd);

module.exports = router;