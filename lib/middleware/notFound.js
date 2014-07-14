var asimov = require('asimov');
var fs = require('fs');

var notFoundPagePath, notFoundPageExists;

module.exports = function notFoundMiddleware (req, res, next) {

  if (!notFoundPagePath) notFoundPagePath = asimov.config('server.sourceDir') + '/404/index.html';
  if (notFoundPageExists === undefined) notFoundPageExists = fs.existsSync(notFoundPagePath);

  if (notFoundPageExists) {

    res.status(404);
    res.sendfile(notFoundPagePath);

    asimov.logSince('server', 'Responded with 404 Not Found @ ' + req.url, req.started);
  }
  else {

    next();
  }
};
