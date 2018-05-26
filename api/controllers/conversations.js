'use strict';

var util = require('util');
const { get, getSync, putSync } = require('../helpers/db');
const { checkToken } = require('../helpers/token');

module.exports = {
    get_conversations: getAllConversations,
    post_conversations: createNewConversation,
    get_conversation: getAllConversationMessage,
    post_conversation: chatToConversation,
    put_conversation: updateConversationReadingStatus
};

function getAllConversations(req, res) {
    var user = req.swagger.params.user.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    var listCon, listU, list = [];

    if (check.isValid && !check.isExpired) {
        get(`u.${user}.con`, (err, value) => {
            listCon = value.split(';');
            get(`u.${user}.u`, (err, value) => {
                listU = value.split(';');
                var getContent = (i, callback) => {
                    if (i == listCon.length) {
                        callback();
                        return;
                    }
                    get(`con.${listCon[i]}.latestMsgId`, (err, value) => {
                        var latestMsgId = parseInt(value);
                        get(`con.${listCon[i]}.u.${user}`, (err, value) => {
                            var currMsgId = parseInt(value);
                            list.push({ 
                                conId: parseInt(listCon[i]), 
                                user: listU[i], 
                                latestMsgId, 
                                currMsgId
                            });
                            getContent(i + 1, callback);
                        });
                    });
                };
                getContent(0, () => {
                    res.json({ status: 200, list});
                });
            });       
        });
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function createNewConversation(req, res) {
    var user = req.swagger.params.user.value;
    var toUser = req.swagger.params.toUser.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        get(`u.${toUser}`, (err, value) => {
            if (!err) {
                get('con.latestConId', (err, value) => {
                    var currConId = parseInt(value) + 1;
                    putSync(`con.${currConId}.u`, `${user};${toUser}`);
                    putSync(`con.${currConId}.latestMsgId`, `0`);
                    putSync(`con.${currConId}.u.${user}`, '0');
                    putSync(`con.${currConId}.u.${toUser}`, '0');
                    putSync('con.latestConId', currConId);
                    get(`u.${user}.con`, (err, value) => {
                        putSync(`u.${user}.con`, value != '' ? `${value};${currConId}` : `${currConId}`);
                    });
                    get(`u.${user}.u`, (err, value) => {
                        putSync(`u.${user}.u`, value != '' ? `${value};${toUser}` : `${toUser}`);
                    });
                    get(`u.${toUser}.con`, (err, value) => {
                        putSync(`u.${toUser}.con`, value != '' ? `${value};${currConId}` : `${currConId}`);
                    });
                    get(`u.${toUser}.u`, (err, value) => {
                        putSync(`u.${toUser}.u`, value != '' ? `${value};${user}` : `${user}`);
                    });
                    res.json({ status: 200, conId: currConId, message: 'Conversation has created successfully' });
                });
            } else {
                res.json({ status: 400, message: 'User does not exist' });
            }
        });             
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function getAllConversationMessage(req, res) {
    var conId = req.swagger.params.conId.value;
    var user = req.swagger.params.user.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    var list = [];

    if (check.isValid && !check.isExpired) {
        get(`con.${conId}.latestMsgId`, (err, value) => {
            var curr = parseInt(value);
            var getMsg = (i, callback) => {
                if (i > curr) {
                    callback();
                    return;
                }
                get(`con.${conId}.${i}`, (err, value) => {
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

function chatToConversation(req, res) {
    var conId = req.swagger.params.conId.value;
    var user = req.swagger.params.user.value;
    var time = req.swagger.params.time.value;
    var message = req.swagger.params.message.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);

    if (check.isValid && !check.isExpired) {
        get(`con.${conId}.latestMsgId`, (err, value) => {
            var latestMsgId = parseInt(value) + 1;
            putSync(`con.${conId}.${latestMsgId}`, `${time};${user};${message}`);
            putSync(`con.${conId}.latestMsgId`, latestMsgId);
            putSync(`con.${conId}.u.${user}`, latestMsgId);
            res.json({ status: 200, message: 'Send message successfully' });
        });
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function updateConversationReadingStatus(req, res) {
    var conId = req.swagger.params.conId.value;
    var user = req.swagger.params.user.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);

    if (check.isValid && !check.isExpired) {
        get(`con.${conId}.latestMsgId`, (err, value) => {
            var latestMsgId = parseInt(value);
            putSync(`con.${conId}.u.${user}`, latestMsgId);
            res.json({ status: 200, message: 'Update reading status successfully' });
        });   
    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}