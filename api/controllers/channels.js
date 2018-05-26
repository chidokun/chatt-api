'use strict';

var util = require('util');
const { get, getSync, putSync } = require('../helpers/db');
const { checkToken } = require('../helpers/token');

module.exports = {
    get_channels: getAllChannels,
    post_channels: createJoinChannel,
    get_channel: getAllChannelMessage,
    post_channel: chatToChannel,
    put_channel: updateChannelReadingStatus,
};

function getAllChannels(req, res) {
    var user = req.swagger.params.user.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    var listChannel, list = [];

    if (check.isValid && !check.isExpired) {
        get(`u.${user}.channels`, (err, value) => {
            listChannel = value.split(';');
            var getContent = (i, callback) => {
                if (i == listChannel.length) {
                    callback();
                    return;
                }
                get(`chan.${listChannel[i]}.latestMsgId`, (err, value) => {
                    var latestMsgId = parseInt(value);
                    get(`chan.${listChannel[i]}.u.${user}`, (err, value) => {
                        var currMsgId = parseInt(value);
                        list.push({ 
                            channel: listChannel[i], 
                            latestMsgId, 
                            currMsgId
                        });
                        getContent(i + 1, callback);
                    });
                });
            };
            getContent(0, () => {
                res.json({ status: 200, user: user, list});
            });       
        });
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function createJoinChannel(req, res) {
    var user = req.swagger.params.user.value;
    var channel = req.swagger.params.channel.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        get(`chan.${channel}.u`, (err, value) => { 
            get(`u.${user}.channels`, (err, value) => {
                putSync(`u.${user}.channels`, value != '' ? `${value};${channel}` : `${channel}`);
            });
            get(`chan.${channel}.u`, (err, value) => {
                putSync(`chan.${channel}.u`, value != '' ? `${value};${user}` : `${user}`);
            });
            putSync(`chan.${channel}.u.${user}`, 0);
            if (err) {
                putSync(`chan.${channel}.latestMsgId`, 0);
            }
            get(`chan.${channel}.latestMsgId`, (err, value) => {
                res.json({ 
                    status: 200,
                    channel: { channel, latestMsgId: err ? 0 : parseInt(value), currMsgId: 0 },                    
                    message: 'Create channel successfully' 
                });
            })
        });
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function getAllChannelMessage(req, res) {
    var channel = req.swagger.params.channel.value;
    var user = req.swagger.params.user.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    var list = [];

    if (check.isValid && !check.isExpired) {
        get(`chan.${channel}.latestMsgId`, (err, value) => {
            var curr = parseInt(value);
            var getMsg = (i, callback) => {
                if (i > curr) {
                    callback();
                    return;
                }
                get(`chan.${channel}.${i}`, (err, value) => {
                    var ar = value.split(';');
                    list.push({
                        msgId: i,
                        user: ar[1],
                        time: parseInt(ar[0]),
                        message: ar[2]
                    });
                    getMsg(i + 1, callback);
                })
            }
            getMsg(1, () => {
                res.json({ status: 200, list });
            });
        });  
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function chatToChannel(req, res) {
    var channel = req.swagger.params.channel.value;
    var user = req.swagger.params.user.value;
    var time = req.swagger.params.time.value;
    var message = req.swagger.params.message.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);

    if (check.isValid && !check.isExpired) {
        get(`chan.${channel}.latestMsgId`, (err, value) => {
            var latestMsgId = parseInt(value) + 1;
            putSync(`chan.${channel}.${latestMsgId}`, `${time};${user};${message}`);
            putSync(`chan.${channel}.latestMsgId`, latestMsgId);
            putSync(`chan.${channel}.u.${user}`, latestMsgId);
            res.json({ status: 200, message: 'Send message successfully' });
        });
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function updateChannelReadingStatus(req, res) {
    var channel = req.swagger.params.channel.value;
    var user = req.swagger.params.user.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);

    if (check.isValid && !check.isExpired) {
        get(`chan.${channel}.latestMsgId`, (err, value) => {
            var latestMsgId = parseInt(value);
            putSync(`chan.${channel}.u.${user}`, latestMsgId);
            res.json({ status: 200, message: 'Update reading status successfully' });
        });   
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}