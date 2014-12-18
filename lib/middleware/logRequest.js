var asimov = require('asimov');
var onHeaders = require('on-headers');

var server = asimov.config('server.instance');

function logRequestMiddleware (req, res, next) {

  var started = new Date();
  server.logger.low('static', 'Incoming ' + req.method.toUpperCase() + ' request @ ' + req.url);

  onHeaders(res, function () {
    server.logger.since('static', 'Responded with ' + res.statusCode + ' to ' + req.method.toUpperCase() + ' request @ ' + req.url, started);
  });

  next();
}

module.exports = logRequestMiddleware;