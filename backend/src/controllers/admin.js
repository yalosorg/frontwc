const User = require('../models/User.js');

/**
 * 
 * @param {Number} req.body.user_id
 * @param {Number} req.body.hours
 * @returns 
 */

// ТАК СМОТРИ, вот эта функция ренью на количество часов увеличивает длительность подписки
// может только админ, щас мы просто ендпоинт создадим новый типа хендлпэй, и там тоже самое пропишем по факту, ну алгоритм сам

module.exports.renew = async (req, res) => {
    const user_id = req.body?.user_id;
    const time = req.body.hours;
    const isAdmin = req.user.isAdmin;

    if (!user_id) {
        return res.status(400).json({
            message: 'User id is required'
        });
    }

    if (!time) {
        return res.status(400).json({
            message: 'Time is required'
        });
    }

    if (!isAdmin) {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    const user = User.findOne({ _id: user_id }, { _id: 1, subscription: 1 });

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const date = new Date().getTime() + (time * 60 * 60 * 1000); // время в миллисекундах, прибавляем к нему количество часов
    // 60 * 60 * 1000 - это количество миллисекунд в часе

    try {
        user.subscription = date;
        await user.save();

        return res.status(200).json({
            message: 'Subscription successfully renewed'
        });
    }

    catch (err) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
}

/**
 * 
 * @param {Number} req.body.user_id
 * @returns 
 */


module.exports.cancel = async (req, res) => {
    const user_id = req.body?.user_id;
    const isAdmin = req.user.isAdmin;

    if (!user_id) {
        return res.status(400).json({
            message: 'User id is required'
        });
    }

    if (!isAdmin) {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    const user = await User.findOne({ _id: user_id }, { _id: 1, subscription: 1 });
    console.log(user.subscription);

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }

    try {
        user.subscription = 0;
        await user.save();

        return res.status(200).json({
            message: 'Subscription successfully canceled'
        });
    }

    catch (err) {
        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
}

module.exports.getAllUsers = async (req, res) => {
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    const users = await User.find({}, { _id: 1, login: 1 }).lean();

    return res.status(200).json({
        message: 'Users successfully received',
        users
    });
}

/**
 * 
 * @param {Number} req.body.id
 * @returns 
 */

module.exports.getUser = async (req, res) => {
    const user_id = req.params?.id;
    const isAdmin = req.user.isAdmin;

    if (!user_id) {
        return res.status(400).json({
            message: 'User id is required'
        });
    }

    if (!isAdmin) {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    if (user_id.match(/^[0-9a-fA-F]{24}$/)) {
        const user = await User.findOne({ _id: user_id }, { _id: 1, login: 1, email: 1, subscription: 1 }).lean();

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'User successfully received',
            user
        });
    }
    else res.status(401).json({ message: 'Invalid user id' });
}

module.exports.uploadFile = (req, res) => {
    const file = req.file;
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    if (!file) {
        return res.status(400).json({
            message: 'No file uploaded'
        });
    }


    res.status(200).json({
        message: 'File uploaded successfully',
        fileName: file.originalname,
        filePath: file.path
    });
}