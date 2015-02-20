var asimov = require('asimov');
var healthy = false;

function healthCheckMiddleware (req, res, next) {

  if (req.url === '/health') {

    if (healthy) {
      res.send({});
    }
    else {
      asimov.requestData({
        'healthCheck': true
      }, function (data) {
        if (data.healthy) {
          healthy = true;
          return res.send({});
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
    data.healthy = asimov.config('server.healthy');
    next(data);
  }
}

exports.middleware = healthCheckMiddleware;
exports.responder = healthCheckResponder;