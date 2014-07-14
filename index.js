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

  asimov.premiddleware(require('./lib/middleware/languageRedirect'));
  asimov.premiddleware(require('./lib/middleware/homeRedirect'));
  asimov.postmiddleware(require('./lib/middleware/notFound'));
};

// // Export public classes
// [
//   'Master',
//   'Worker'
// ].forEach(function (path) {
//
//   var name = path.split('/').pop();
//   module.exports[name] = require('./lib/' + path);
// });

module.exports.Helper = require('./lib/helpers/Helper');

module.exports.start = function bootstrap (next) {

  asimov
    .use(module.exports)
    .start(next);
};

module.parent || module.exports.start();
