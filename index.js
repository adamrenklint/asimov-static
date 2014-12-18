var asimov = require('asimov');
var server = require('asimov-server');
var Loader = require('./lib/core/Loader');

module.exports = function plugin () {

  asimov
    .config('defaultLangCode', 'en')
    .config('languages', ['en']);

  asimov.use(server);

  asimov.init(function (next) {

    if (process.env.ROLE === 'worker') {
      var loader = new Loader({
        'frameworkDir': __dirname
      });

      loader.start(next);
    }
    else {
      next();
    }
  });

  asimov.premiddleware(require('./lib/middleware/logRequest'));
  asimov.premiddleware(require('./lib/middleware/languageRedirect'));
  asimov.premiddleware(require('./lib/middleware/homeRedirect'));

  var responseTime = require('response-time');
  asimov.middleware(responseTime());

  if (process.env.ENV === 'development') {
    var dirtyRenderCheck = require('./lib/middleware/dirtyRenderCheck');
    asimov.middleware(dirtyRenderCheck.middleware);
    asimov.handleDataRequest(dirtyRenderCheck.responder);
  }
  else {
    asimov.middleware(require('./lib/middleware/memoryCache'));
  }

  asimov.postmiddleware(require('./lib/middleware/notFound'));
};

module.exports.Helper = require('./lib/helpers/Helper');

module.exports.start = function bootstrap (next) {

  asimov
    .use(module.exports)
    .start(next);
};

module.parent || module.exports.start();
