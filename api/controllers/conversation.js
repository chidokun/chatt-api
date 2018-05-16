'use strict';

var util = require('util');
const { get, getSync, putSync } = require('../helpers/db');
const { checkToken } = require('../helpers/token');

module.exports = {
    get_conversations: getAllConversation,
    post_conversations: createNewConversation,
    get_conversation: getAllConversationMessage,
    post_conversation: chatToConversation,
    put_conversation: updateConversationReadingStatus
};

// on doing
function getAllConversation(req, res) {
    var user = req.swagger.params.user.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    var listCon, listU;

    if (check.isValid && !check.isExpired) {
        get(`u.${user}.con`, (err, value) => {
            listCon = value.split(';');
            get(`u.${user}.u`, (err, value) => {
                listU = value.split(';');
                        
            });       
        });
    } else {
        res.json({ message: 'Token is invalid or expired' });
    }
}

/**
 * 
 */
function createNewConversation(req, res) {
    var user = req.swagger.params.user.value;
    var toUser = req.swagger.params.toUser.value;
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        try {
            get('con.latestConId', (err, value) => {
                var currConId = parseInt(value) + 1;
                get(`u.${user}`, (err, value) => {
                    if (!err && value != '') {
                        putSync(`con.${currConId}.u`, `${user};${toUser}`);
                        putSync(`con.${currConId}.latestMsgId`, `0`);
                        putSync(`con.${currConId}.0`, '');
                        putSync(`con.${currConId}.u.${user}`, '0');
                        putSync(`con.${currConId}.u.${toUser}`, '0');
                        res.json({ message: 'Conversation has created successfully' });
                    } else {
                        res.json({ message: 'User does not exist' });
                    }
                });
            });
        } catch {
            res.json({ message: 'Can not create new conversation' });
        }      
    } else {
        res.json({ message: 'Token is invalid or expired' });
    }
}

function getAllConversationMessage(req, res) {
    var conId = req.swagger.params.conId.value;
    var user = req.swagger.params.user.value;
    var token = req.swagger.params.token.value;
    var list = [];

    if (check.isValid && !check.isExpired) {
        get(`con.${conId}.latestMsgId`, (err, value) => {
            var curr = parseInt(value);
            var getMsg = (id) => {
                get(`con.${conId}.${id}`, (err, value) => {
                    var ar = value.split(';');
                    list.push({
                        msgId: id,
                        user: ar[1],
                        time: ar[0],
                        message: ar[2]
                    });
                    if (curr - id <= 100 && id >= 0) {
                        getMsg(id - 1);
                    }
                })
            }
            getMsg(curr);
        });
        res.json({
            list: list
        })
    } else {
        res.json({ message: 'Token is invalid or expired' });
    }

    res.json(hello);
}

function chatToConversation(req, res) {
    // var name = req.swagger.params.name.value || 'stranger';
    // var hello = util.format('Hello, %s!', name);
  
    // res.json(hello);
}

function updateConversationReadingStatus(req, res) {
    // var name = req.swagger.params.name.value || 'stranger';
    // var hello = util.format('Hello, %s!', name);
  
    // res.json(hello);
}