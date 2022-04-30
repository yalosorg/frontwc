const router = require('express').Router();
const passport = require('passport');

const controller = require('../controllers/admin.js'); 
const upload = require('../middleware/upload.js');

// Продление подписки
// POST /api/admin/renew
router.post('/renew', controller.renew);

// Убрать подписку
// POST /api/admin/renew
router.post('/cancel', passport.authenticate('jwt', { session: false }), controller.cancel);

// Получение всех юзеров
// GET /api/admin/getAllUsers
router.get('/getAllUsers', passport.authenticate('jwt', { session: false }), controller.getAllUsers);

// Получение информации о пользователе
// GET /api/admin/getUser
router.get('/getUser/:id', passport.authenticate('jwt', { session: false }), controller.getUser);

// Загрузка файла
// POST /api/admin/upload
router.post('/upload', passport.authenticate('jwt', { session: false }), upload.single('zip'), controller.uploadFile);

module.exports = router;