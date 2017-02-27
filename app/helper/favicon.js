var fs = require('fs');
var path = require('path');

function readFile(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

module.exports = function(fav, options) {
  fav = path.resolve(fav);
  options = options || {};

  var maxAge = options.maxAge === null ? 86400000 : Math.min(Math.max(0, options.maxAge), 31556926000);

  return function*(next) {
    if (!this.path.includes('/favicon.ico')) {
      return yield next;
    }

    if (!fav) return;

    if ('GET' !== this.method && 'HEAD' !== this.method) {
      this.status = 'OPTIONS' == this.method ? 200 : 405;
      this.set('Allow', 'GET, HEAD, OPTIONS');
      return;
    }

    this.set('Cache-Control', 'public, max-age=' + (maxAge / 1000 | 0));
    this.type = 'image/x-icon';
    this.body = yield readFile(fav);
  };
};
