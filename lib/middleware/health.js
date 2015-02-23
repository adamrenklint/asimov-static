var asimov = require('asimov');
var healthy = false;

var up = {
  'up': true
};

function healthCheckMiddleware (req, res, next) {

  if (req.url === '/health' || req.url === '/api/health') {
    if (healthy) {
      res.send(up);
    }
    else {
      asimov.requestData({
        'healthCheck': true
      }, function (data) {
        if (data.healthy) {
          healthy = true;
          return res.send(up);
        }
        else {
          res.status(404);
          res.end('Not found');
        }
      });
    }
  }
  else {
    next();
  }
}

function healthCheckResponder (data, next) {

  if (data.healthCheck) {
    data.healthy = asimov.config('server.ready');
  }
  next(data);
}

exports.middleware = healthCheckMiddleware;
exports.responder = healthCheckResponder;
