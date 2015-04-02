var assert = require('assert');
var mail = require('../../app/support');

describe('mail service', function () {
  it('#sendMail should work', function (done) {
    this.timeout(5000);
    mail.sendMail('Test', '密送测试2').then(function (data) {
      assert(data);
      done();
    }, function (rej) {
      done(rej);
    });
  });
});