var asimov = require('asimov');
var server = require('asimov-server');
var Loader = require('./lib/core/Loader');

// keep PREBUILD_STATIC_PUBLIC backwards compatible with ENV=prebuild
if (process.env.ENV === 'prebuild') {
  process.env.PREBUILD_STATIC_PUBLIC = true;
}

module.exports = function plugin () {

  asimov
    .config('defaultLangCode', 'en')
    .config('defaultLangFallback', true)
    .config('languages', ['en'])
    .config('server.ready', false);

  if (!process.env.PREBUILD_STATIC_PUBLIC) {
    asimov.use(server);

    asimov.premiddleware(require('./lib/middleware/logRequest'));
    asimov.premiddleware(require('./lib/middleware/languageRedirect'));
    asimov.premiddleware(require('./lib/middleware/homeRedirect'));

    var health = require('./lib/middleware/health');
    asimov.premiddleware(health.middleware);
    asimov.handleDataRequest(health.responder);

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
  }


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
};

module.exports.Helper = require('./lib/helpers/Helper');

module.exports.start = function bootstrap (next) {

  asimov
    .use(module.exports)
    .start(next);
};

module.parent || module.exports.start();
