const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');
const jwtSecret = require('../libs/config.js').key;

module.exports.login = async function(req, res) {
    console.log(req.body)
    const login = req.body.login;
    const password = req.body.password;

    if(!login) {
        return res.status(400).json({
            message: 'Login is required'
        });
    }

    if(!password) {
        return res.status(400).json({
            message: 'Password is required'
        });
    }

    const user = await User.findOne({ login }).lean();

    if(user) {
        // проверка пароля, пользователь существует
        const isPasswordValid = await bcrypt.compareSync(password, user.password);

        if(isPasswordValid) {
            // Генерация токена если пароли совпали

            const token = jwt.sign({
                _id: user._id,
                email: user.email
            }, jwtSecret, { expiresIn: '1h' });

            return res.status(200).json({
                token: 'Bearer ' + token,
            });
        } else {
            return res.status(401).json({
                message: 'Invalid password'
            });
        }
        
    } else {
        return res.status(400).json({
            message: 'Invalid login'
        });
    }
}

module.exports.register = async function(req, res) {
    const email = req.body?.email;
    const login = req.body?.login;
    const password = req.body?.password;
    
    if(!email) {
        return res.status(400).json({
            message: 'Email is required'
        });
    }

    // пофиксил

    if(!password) {
        return res.status(400).json({
            message: 'Password is required'
        });
    }

    else if(password.length < 8) {
        return res.status(400).json({
            message: 'Password is too short'
        });
    }

    else if(!login) {
        return res.status(400).json({
            message: 'Login is required'
        });
    }

    const candidat = await User.findOne({ email }).lean();
    
    if(candidat) {
        // This email is already registered
        res.status(400).json({
            message: 'This email is already registered'
        });
    }

    else {
        const salt = await bcrypt.genSalt(10);
        const user = new User({
            email,
            login,
            password: bcrypt.hashSync(password, salt),
            subscription: new Date(),
            isAdmin: false
        });

        try {
            await user.save();
            return res.status(201).json({
                message: 'User created'
            });
        }

        catch(e) {
            res.status(500).json({
                message: 'Something went wrong'
            });
        }

    }
}
