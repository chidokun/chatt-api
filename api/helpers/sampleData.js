var { putSync, get } = require('./db');

function runSampleData() {
    // user
    putSync('u.tuan', '123');
    putSync('u.tuan.channels', 'zlpay;kosocho');
    putSync('u.tuan.con', '1;2;3');
    putSync('u.tuan.u', 'thinh;trung;vu');

    putSync('u.thinh', '123');
    putSync('u.thinh.channels', 'zlpay');
    putSync('u.thinh.con', '1;4');
    putSync('u.thinh.u', 'tuan;trung');

    putSync('u.trung', '123');
    putSync('u.trung.channels', 'kosocho');
    putSync('u.trung.con', '2;4');
    putSync('u.trung.u', 'tuan;thinh');

    putSync('u.vu', '123');
    putSync('u.vu.channels', '');
    putSync('u.vu.con', '3');
    putSync('u.vu.u', 'tuan');

    putSync('chan.zlpay.u', 'tuan;thinh');
    putSync('chan.zlpay.latestMsgId', 3);
    putSync('chan.zlpay.1', Date.now() +';tuan;hello!');
    putSync('chan.zlpay.2', Date.now() +';thinh;hi!');
    putSync('chan.zlpay.3', Date.now() +';tuan;how are you!');
    putSync('chan.zlpay.u.tuan', 3);
    putSync('chan.zlpay.u.thinh', 2);

    putSync('chan.kosocho.u', 'tuan;trung');
    putSync('chan.kosocho.latestMsgId', 3);
    putSync('chan.kosocho.1', Date.now() +';trung;hello!');
    putSync('chan.kosocho.2', Date.now() +';tuan;hi!');
    putSync('chan.kosocho.3', Date.now() +';trung;how are you!');
    putSync('chan.kosocho.u.trung', 3);
    putSync('chan.kosocho.u.tuan', 2);

    putSync('con.1.u', 'tuan;thinh');
    putSync('con.1.latestMsgId', 3);
    putSync('con.1.1', Date.now() + ';thinh;hi');
    putSync('con.1.2', Date.now() + ';thinh;hello');
    putSync('con.1.3', Date.now() + ';thinh;how are you');
    putSync('con.1.u.tuan', 0);
    putSync('con.1.u.thinh', 3);

    putSync('con.2.u', 'tuan;trung');
    putSync('con.2.latestMsgId', 2);
    putSync('con.2.1', Date.now() + ';tuan;hi');
    putSync('con.2.2', Date.now() + ';trung;hello');
    putSync('con.2.u.tuan', 1);
    putSync('con.2.u.trung', 2);

    putSync('con.3.u', 'tuan;vu');
    putSync('con.3.latestMsgId', 2);
    putSync('con.3.1', Date.now() + ';tuan;hi');
    putSync('con.3.2', Date.now() + ';tuan;hello');
    putSync('con.3.u.tuan', 2);
    putSync('con.3.u.vu', 0);

    putSync('con.4.u', 'thinh;trung');
    putSync('con.4.latestMsgId', 2);
    putSync('con.4.1', Date.now() + ';thinh;hi');
    putSync('con.4.2', Date.now() + ';trung;hello');
    putSync('con.4.u.thinh', 2);
    putSync('con.4.u.trung', 2);

    putSync('con.latestConId', 4);
}

runSampleData();