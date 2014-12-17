var asimov = require('asimov');
var onHeaders = require('on-headers');

var server = asimov.config('server.instance');

function logRequestMiddleware (req, res, next) {

  var started = new Date();
  server.logger.low('static', 'Incoming ' + req.method.toUpperCase() + ' request @ ' + req.url);

  onHeaders(res, function () {
    server.logger.lowSince('static', 'Outgoing response for ' + req.method.toUpperCase() + ' request @ ' + req.url, started);
  });

  next();
}

module.exports = logRequestMiddleware;