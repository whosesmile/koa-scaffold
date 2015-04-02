var assert = require('assert');
var mail = require('../../app/config/mail');

describe('mail service', function () {
  it('#sendMail should work', function (done) {
    this.timeout(5000);
    mail.sendMail('你好', '密送测试').then(function (data) {
      assert(data);
      done();
    }, function (rej) {
      done(rej);
    });
  });
});