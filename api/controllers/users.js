'use strict';

const util = require('util');
const { get, putSync } = require('../helpers/db');
const { checkToken, generateToken } = require('../helpers/token');

module.exports = {
    get_users: existenceUser,
    post_users: signUp,
    login: login,
    logout: logout
};

function existenceUser(req, res) {
    // var user = req.swagger.params.user.value;
    // var token = req.swagger.params.token.value;
    // var check = checkToken(token);

    // if (check.isValid && !check.isExpired) {
    //     get(`u.${user}`, (err, value) => {
    //         res.json({
    //             user: user,
    //             exists: !err && value != ''
    //         });
    //     });
    // } else {
    //     res.json({ message: 'Token is invalid or expired' });
    // }

    res.json({
        user: 'abc',
        exists: true
    })
}

function signUp(req, res) {
    var user = req.swagger.params.user.value;
    var password = req.swagger.params.password.value;

    try {
        putSync(`u.${user}`, password);
        putSync(`u.${user}.channels`, '');
        putSync(`u.${user}.con`, '');
        putSync(`u.${user}.u`, '');

        res.json({ status: 200, message: 'Sign up successfully' });
    } catch {
        res.json({ status: 400, message: 'Sign up unsuccessfully' });
    } 
}

function login(req, res) {
    var user = req.swagger.params.user.value;
    var password = req.swagger.params.password.value;

    get(`u.${user}`, (err, value) => {
        if (!err && value == password) {
            var token = generateToken(user);
            res.json({
                status: 200,
                user: user,
                expire: Date.now() + 2592000000,
                token: token
            });
        } else {
            res.json({ status: 400, message: 'User name or password is not correct'});
        }
    });    
}

function logout(req, res) {
    // var name = req.swagger.params.name.value || 'stranger';
    // var hello = util.format('Hello, %s!', name);
  
    // res.json(hello);
}