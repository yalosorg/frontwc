const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('../src/views/index.ejs');
});

router.get('/login', (req, res) => {
    res.render('../src/views/login.ejs');
});

router.get('/register', (req, res) => {
    res.render('../src/views/register.ejs');
});

router.get('/logout', (req, res) => {
    res.render('../src/views/logout.ejs');
});

router.get('/admin', (req, res) => {
    res.render('../src/views/admin.ejs');
});

router.get('/admin/user/:id', (req, res) => {
    res.render('../src/views/someuserid.ejs', { id: req.params.id });
});

router.get('/subscription', (req, res) => {
    res.render('../src/views/subscription.ejs');
});

router.get('/storage', (req, res) => {
    res.render('../src/views/storage.ejs');
});

module.exports = router;