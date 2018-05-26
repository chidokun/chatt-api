var level = require('level-rocksdb');
var db = level('./db');

module.exports = {
  get,
  put,
  getSync,
  putSync,
  delSync
};

// get('con.latestConId', (err, value) => {
//     if (err) {
//         putSync('con.latestConId', '0');
//     }
// });

function get(name, callback) {
    db.get(name, function (err, value) {
        callback(err, value)
    });
}

function put(key, value, callback) {
    db.put(key, value, callback);
}

async function getSync(name) {
    return await new Promise((resolve, reject) => {
        get(name, function (err, value) {
            return resolve({
                err,
                value
            });
        });
    });
}

async function putSync(key, value) {
    return await new Promise((resolve, reject) => {
        put(key, value, function (err) {
            return resolve({
                err,
            });
        });
    });
}

async function delSync(key) {
    return await new Promise((resolve, reject) => {
        db.del(key, function (err) {
            return resolve({
                err,
            })
        });
    });
}