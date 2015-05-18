var app = require('../../app');
var support = require('../../support');
var service = require('./service');
var _ = require('lodash');

var models = require('../../config').models;
var Work = models.Work;

app.redirect('/', '/home');

app.get('/work', function * (next) {
  this.body = this.template.render('templates/work.html');
});

app.post('/work', function * (next) {
  var form = this.request.body;
  var work = yield Work.create(form);

  this.redirect('/success');
});

app.get('/success', function * (next) {

  this.body = this.template.render('templates/success.html');
});

app.get('/home', function * (next) {
  var list = yield service.query();
  this.body = this.template.render('templates/home.html', {
    list: list
  });
});