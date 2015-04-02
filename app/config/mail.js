var nodemailer = require('nodemailer');

// 发件人
var email = {
  nick: '李双宝',
  user: 'smilelegend@smilelegend.com',
  pass: 'idontknow123456'
};

// 收件人列表
var receivers = ['lovemoon@yeah.net', 'whosesmile@gmail.com'];

// 构建
var transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  secure: true,
  auth: email
});

// 提供接口
exports.sendMail = function (title, message) {
  return new Promise(function (resolve, reject) {
    transporter.sendMail({
      from: email.nick + '<' + email.user + '>', // sender address
      bcc: receivers,
      subject: title || '测试邮件',
      html: message || 'Just a testing~'
    }, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(info.response);
    });
  });
};