var nodemailer = require('nodemailer');

// 发件人
var sender = {
  nick: '李双宝',
  user: 'noreply@smilelegend.com',
  pass: 'fuckpassword8'
};

// 收件人列表
var receivers = ['lovemoon@yeah.net', 'whosesmile@gmail.com', 'smilelegend@smilelegend.com'];

// 构建
var transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  secure: true,
  auth: sender
});

// 提供接口
exports.sendMail = function (title, message) {
  return new Promise(function (resolve, reject) {
    transporter.sendMail({
      from: sender.nick + '<' + sender.user + '>', // sender address
      bcc: receivers,
      subject: title,
      html: message
    }, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve(info.response);
    });
  });
};