var asimov = require('asimov');

module.exports = function notFoundMiddleware (req, res, next) {

  var languages = asimov.config('languages').join('|');
  var localizedRE = new RegExp('^/(' + languages + ')/home');

  if (req.url.indexOf('/home') === 0 || req.url.match(localizedRE)) {
    req.url = req.url.replace('/home', '');
    req.url = req.url || '/';
  }

  next();
};
