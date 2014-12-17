var asimov = require('asimov');
var fs = require('fs');
var uuid = require('node-uuid');
var etag = uuid.v1();
var pages = {};

function memoryCacheMiddleware (req, res, next) {

  if (req.url[req.url.length - 1] !== '/') return next();

  if (!pages[req.url]) {
    var filePath = asimov.config('server.sourceDir') + req.url + 'index.html';
    var exists = fs.existsSync(filePath);
    pages[req.url] = exists && fs.readFileSync(filePath, 'utf8');
  }

  if (!pages[req.url]) {
    next();
  }
  else {
    res.set({
      'Content-Type': 'text/html',
      'E-Tag': etag
    });
    res.end(pages[req.url]);
  }
}

module.exports = memoryCacheMiddleware;