const User = require('../models/user');
const Password = require('../models/password');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/index');

module.exports = {
    getUserFromDB: async (req, res, next) => {
        const { email, password } = req.body;
        const user = await User.findOne({ 'email': email });
        if(user) {
            const result = await Password.findByUserIDPassword(user.id, password);
            if(result === true) {
                res.locals.user = user;
                next();
            } else {
                res.status(401).send('User not found');
            }
        } else {
            res.status(401).send('User not found');
        }
    },
    isUser: async (req, res, next) => {
        let token = req.headers['authorization'];
        try {
            token = jwt.verify(token, JWT_SECRET);
            if(!token.isDeleted) {
                res.locals.token = token;
                next();
            } else {
                res.status(401).send('User not logged in');
            }
        } catch (e) {
            res.status(401).send('User not logged in');
        }
    }
}