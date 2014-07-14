var asimov = require('asimov');

module.exports = function notFoundMiddleware (req, res, next) {

  var langCode = asimov.config('defaultLangCode');

  if (req.url.indexOf('/' + langCode + '/') === 0 || req.url === '/' + langCode) {

    var url = req.url.replace('/' + langCode, '');
    return res.redirect(url || '/');
  }

  next();
};
