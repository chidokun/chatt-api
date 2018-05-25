var { put } = require('./db');

function runSampleData() {
    // user
    put('u.tuan', '123');
    put('u.tuan.channels', 'zlpay;kosocho');
    put('u.tuan.con', '1;2;3');
    put('u.tuan.u', 'thinh;trung;vu');

    put('u.thinh', '123');
    put('u.thinh.channels', 'zlpay');
    put('u.thinh.con', '1;4');
    put('u.tuan.u', 'tuan;trung');

    put('u.trung', '123');
    put('u.trung.channels', 'kosocho');
    put('u.trung.con', '2;4');
    put('u.trung.u', 'tuan;thinh');

    put('u.vu', '123');
    put('u.vu.channels', '');
    put('u.vu.con', '');
    put('u.vu.u', '');

    put('chan.zlpay.u', 'tuan;thinh');
    put('chan.zlpay.latestMsgId', 3);
    put('chan.zlpay.1', Date.now() +';tuan;hello!');
    put('chan.zlpay.2', Date.now() +';thinh;hi!');
    put('chan.zlpay.3', Date.now() +';tuan;how are you!');
    put('chan.zlpay.u.tuan', 3);
    put('chan.zlpay.u.thinh', 2);

    put('chan.kosocho.u', 'tuan;trung');
    put('chan.kosocho.latestMsgId', 3);
    put('chan.kosocho.1', Date.now() +';trung;hello!');
    put('chan.kosocho.2', Date.now() +';tuan;hi!');
    put('chan.kosocho.3', Date.now() +';trung;how are you!');
    put('chan.kosocho.u.trung', 3);
    put('chan.kosocho.u.tuan', 2);

    put('con.1.u', 'tuan;thinh');
    put('con.1.latestMsgId', 3);
    put('con.1.1', Date.now() + ';thinh;hi');
    put('con.1.2', Date.now() + ';thinh;hello');
    put('con.1.3', Date.now() + ';thinh;how are you');
    put('con.1.u.tuan', 0);
    put('con.1.u.thinh', 3);

    put('con.2.u', 'tuan;trung');
    put('con.2.latestMsgId', 2);
    put('con.2.1', Date.now() + ';tuan;hi');
    put('con.2.2', Date.now() + ';trung;hello');
    put('con.2.u.tuan', 1);
    put('con.2.u.trung', 2);

    put('con.3.u', 'tuan;vu');
    put('con.3.latestMsgId', 2);
    put('con.3.1', Date.now() + ';tuan;hi');
    put('con.3.2', Date.now() + ';tuan;hello');
    put('con.3.u.tuan', 2);
    put('con.3.u.vu', 0);

    put('con.4.u', 'thinh;trung');
    put('con.4.latestMsgId', 2);
    put('con.4.1', Date.now() + ';thinh;hi');
    put('con.4.2', Date.now() + ';trung;hello');
    put('con.4.u.thinh', 2);
    put('con.4.u.trung', 2);

    put('con.latestConId', 4);
}

runSampleData();