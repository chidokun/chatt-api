"use strict";

const http = require('http');
const SocketServer = require('websocket').server;
const { checkToken } = require('../helpers/token');
const { get } = require('../helpers/db');
const port = 10030;


var clients = [];

var server = http.createServer();
server.listen(port, function() {
    console.log("[SOCKET] - Server is listening on port " + port);
});

var wsServer = new SocketServer({ httpServer: server});
wsServer.on('request', function(request) {
    console.log('[SOCKET] - Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin); 
    console.log('[SOCKET] - Connection accepted.');
    var user;

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var res = JSON.parse(message.utf8Data);
            var check = checkToken(res.token);
            if (check.isValid && !check.isExpired) {
                switch (res.type) {
                    case 'CONNECT':
                        user = res.user;
                        clients[user] = connection;
                        console.log(`[SOCKET] - [${user}] connected.`);
                        break;
                    case 'MESSAGE_CHANNEL':
                        console.log(`[SOCKET] - Message from [${res.params.user}] to [#${res.params.channel}]`);
                        get(`chan.${res.params.channel}.u`, (err, value) => {
                            var listU = value.split(';');
                            get(`chan.${res.params.channel}.latestMsgId`,(err,value) => {
                                var response = {
                                    type: 'MESSAGE_CHANNEL',
                                    channel: { 
                                        channel: res.params.channel,
                                        latestMsgId: parseInt(value)    
                                    },
                                    message: {
                                        time: res.params.time,
                                        user: res.params.user,
                                        message: res.params.message
                                    }
                                };
                                listU.forEach((e) => {
                                    if (e != res.params.user) {
                                        get(`chan.${res.params.channel}.u.${e}`, (err, value) => {
                                            response.channel.currMsgId = parseInt(value);
                                            if (clients[e] != null) {
                                                console.log(`[SOCKET] - Send message to [${e}]`);
                                                clients[e].sendUTF(JSON.stringify(response));
                                            }            
                                        });         
                                    }
                                });
                            });                           
                        });
                        break;
                    case 'MESSAGE_CONVERSATION':
                        console.log(`[SOCKET] - Message from [${res.params.user}]`);
                        get(`con.${res.params.conId}.u`, (err, value) => {
                            var listU = value.split(';');
                            get(`con.${res.params.conId}.latestMsgId`, (err,value) => {
                                var destUser = listU[0] != res.params.user ? listU[0] : listU[1];
                                var response = {
                                    type: 'MESSAGE_CONVERSATION',
                                    con: { 
                                        conId: res.params.conId,
                                        user: res.params.user, 
                                        latestMsgId: parseInt(value)
                                    },
                                    message: {
                                        time: res.params.time,
                                        user: res.params.user,
                                        message: res.params.message
                                    }
                                };
                                get(`con.${res.params.conId}.u.${destUser}`, (err, value) => {
                                    response.con.currMsgId = parseInt(value);
                                    if (clients[destUser] != null) {
                                        console.log(`[SOCKET] - Send message to [#${destUser}]`);
                                        clients[destUser].sendUTF(JSON.stringify(response));
                                    }
                                    
                                });                  
                            });
                        });
                        break;
                    default:
                        break;
                }
            } else {
                connection.sendUTF(JSON.stringify({ 
                    type: 'RESPONSE', 
                    message: 'Token is not valid or expired'
                }));
            }
        }
    });

    connection.on('close', function(connection) {
        console.log(`[${user}] closed connection.`);
        delete clients[user];
    });
});