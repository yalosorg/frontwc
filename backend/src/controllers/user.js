const axios = require("axios");
const User = require("../models/User");
const crystalpay = require("../libs/config").crystalpay;

// ТАМ РАЗНЫЕ ПОДПИСКИ, надо стоимость разную сделать

module.exports.genlink = async (req, res) => {
    if (!req.body.amount) return res.status(400).json({ message: 'please specify the amount' });

    let amount = req.body.amount;
    switch (amount) {
        case '1':
            amount = crystalpay.amount.op1;
            break;
        case '2':
            amount = crystalpay.amount.op2;
            break;
        case '3':
            amount = crystalpay.amount.op3;
            break;
        default: return res.status(400).json({ message: 'specify the correct option of amount' });
    }

    const callbackURI = `http://localhost:3000/api/user/payment/${req.user._id}`;
    const apiURI = `https://api.crystalpay.ru/v1/?s=${crystalpay.key}&n=${crystalpay.name}&o=invoice-create&amount=${amount}&callback=${callbackURI}`;

    const response = await axios.get(apiURI);
    res.status(201).json({ url: response.data.url });
}

module.exports.payment = async (req, res) => {
    const amount = req.body.payamount;
    const id = req.params.id;

    //const month = new Date().getTime() + (time * 60 * 60 * 1000 * 24 * 30); // месяц

    const user = User.findOne({ _id: id });
    if (!user) res.status(401).json({ message: 'user not found' });

    switch (amount) {
        case crystalpay.amount.op1:
            user.subscription = new Date().getTime() + (60 * 60 * 1000 * 24 * 30);
            //User.updateOne({ _id: id }, { subscription: new Date().getTime() + (60 * 60 * 1000 * 24 * 30) });
            break;
        case crystalpay.amount.op2:
            user.subscription = new Date().getTime() + (60 * 60 * 1000 * 24 * 90);
            //User.updateOne({ _id: id }, { subscription: new Date().getTime() + (60 * 60 * 1000 * 24 * 90) });
            break;
        case crystalpay.amount.op3:
            user.subscription = new Date().getTime() + (60 * 60 * 1000 * 24 * 365);
            //User.updateOne({ _id: id }, { subscription: new Date().getTime() + (60 * 60 * 1000 * 24 * 365) });
            break;
    }

    try {
        await user.save();
        res.status(200).json({ message: 'subscription successful' });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}

module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json(user);
    }

    catch (err) {
        res.status(500).json({
            message: err
        });
    }
}

module.exports.getUserMe = async (req, res) => {
    res.status(200).json({ user: req.user });
}