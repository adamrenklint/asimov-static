var asimov = require('asimov');
var locale = require('locale');

module.exports = function notFoundMiddleware (req, res, next) {

  var defaultLangCode = asimov.config('defaultLangCode');
  var supported = new locale.Locales(asimov.config('languages'));
  var accepted = new locale.Locales(req.headers['accept-language']);
  console.log();

  var bestMatch = accepted.best(supported);
  var bestLangCode = bestMatch && bestMatch.code;

  // console.log(req.headers)

  if (req.url.indexOf('/' + defaultLangCode + '/') === 0 || req.url === '/' + defaultLangCode) {

    var url = req.url.replace('/' + defaultLangCode, '');
    return res.redirect(url || '/');
  }

  next();
};
