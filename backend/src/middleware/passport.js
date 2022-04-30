const JwtStategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../models/User.js');
const { key } = require('../libs/config.js');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key
}

module.exports = passport => {
    passport.use(new JwtStategy(options, async(jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload._id).lean();

            if(user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }

        catch(err) {
            return done(err, false);
        }
    }));
}