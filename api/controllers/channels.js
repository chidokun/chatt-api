'use strict';

var util = require('util');

module.exports = {
    get_channels: getAllChannels,
    post_channels: createNewChannel,
    put_channels: putChannels,
    get_channel: getAllChannelMessage,
    post_channel: chatToChannel,
    put_channel: updateChannelReadingStatus,
    patch_channel: joinChannel,
    delete_channel: exitChannel
};

function getAllChannels(req, res) {
    res.json({
        status: 200,
        user: 'abc',
        list: [
            {
                channel: 'dfhd',
                latestMsgId: 12,
                currMsgId: 11
            },
            {
                channel: 'dfhdee',
                latestMsgId: 12,
                currMsgId: 11
            },
            {
                channel: 'fgvcd',
                latestMsgId: 12,
                currMsgId: 11
            }
        ]
    })
}

function createNewChannel(req, res) {
    res.json({ message: 'Create new channel' });
}

function putChannels(req, res) {
    res.json({ message: 'join or create new channel' });
}

function getAllChannelMessage(req, res) {
    res.json({
        status: 200,
        list: [
            {
                msgId: 1,
                user: 'abcd',
                time: 12234234,
                message: 'Hello, my name abc'
            },
            {
                msgId: 2,
                user: 'abcde',
                time: 12234234,
                message: 'Hello, my name abcfgdfsbgf'
            },
            {
                msgId: 3,
                user: 'abcd',
                time: 12234234,
                message: 'Helbdbdgfbdgfme abc'
            }
        ]
    });
}

function chatToChannel(req, res) {
    res.json({ message: 'Chat to channel' });
}

function updateChannelReadingStatus(req, res) {
    res.json({ message: 'Update reading status' });
}

function joinChannel(req, res) {
    res.json({ message: 'join channel' });
}

function exitChannel(req, res) {
    res.json({ message: 'Exit a channel' });
}