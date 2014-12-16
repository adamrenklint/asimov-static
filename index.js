var asimov = require('asimov');
var server = require('asimov-server');
var Loader = require('./lib/core/Loader');
var dirtyRenderCheck = require('./lib/middleware/dirtyRenderCheck');

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

  asimov.premiddleware(require('./lib/middleware/languageRedirect'));
  asimov.premiddleware(require('./lib/middleware/homeRedirect'));
  asimov.middleware(dirtyRenderCheck.middleware);
  asimov.postmiddleware(require('./lib/middleware/notFound'));

  asimov.handleDataRequest(dirtyRenderCheck.responder);
};

module.exports.Helper = require('./lib/helpers/Helper');

module.exports.start = function bootstrap (next) {

  asimov
    .use(module.exports)
    .start(next);
};

module.parent || module.exports.start();
