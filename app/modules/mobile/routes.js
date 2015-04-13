var app = require('../../app');
var assistantService = require('../assistant/service');

// 手机APP 公告详情
// 注意 此处逻辑同 /assistant/notice/:id
app.get('/mobile/notice/:id', function * (next) {
  var data = yield assistantService.getNotice(this.params.id);
  this.body = this.template.render('./modules/assistant/templates/notice.html', data, {
    header: false
  });
});