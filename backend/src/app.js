const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const upload = require('./middleware/upload');
const app = require('./libs/index.js').app;
const server = require('./libs/index.js').config.server;

const authRoutes = require('./routes/auth.js');
const adminRoutes = require('./routes/admin.js');
const userRoutes = require('./routes/user.js');
const fileRoutes = require('./routes/file.js');
// const uploadRoutes = require('./routes/upload.js');

app.use(passport.initialize());
require('./middleware/passport.js')(passport);

app.set('views engine', 'ejs');
app.use(express.static('public'));

app.use(morgan('dev'))
app.use('uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// routes middleware 
app.use('/api/auth', authRoutes); // авторизация
app.use('/api/admin', adminRoutes); // админка
app.use('/api/user', userRoutes); // получение пользователя по Id
app.use('/api/file', fileRoutes); // Работа с файлами 



// routes for rendering pages
app.use('/', require('./client/index.js'));


app.listen(server.port, () => console.log(`[HTTP] listening on port ${server.port}!`));