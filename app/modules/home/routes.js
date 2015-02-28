var app = require('../../app');

// home
app.get('/', function * (next) {
  this.body = template.render('templates/home.html');
});

// home
app.get('/test', function * (next) {
  this.body = JSON.stringify({
    code: 200,
    data: {
      name: '李双宝'
    }
  });
});