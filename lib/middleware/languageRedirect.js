var asimov = require('asimov');
var locale = require('locale');
var fs = require('fs');
var npath = require('path');

function getUrlLangCode (url) {

  var code = url.split('/')[1];
  var supported = asimov.config('languages');
  if (code && supported.indexOf(code) >= 0) {
    return code;
  }
  return '';
}

var cache = {};

function pageExists (url) {

  if (cache[url] === undefined) {
    var path = npath.join(asimov.config('server.sourceDir'), url, 'index.html');
    cache[url] = fs.existsSync(path);
  }

  return cache[url];
}

module.exports = function notFoundMiddleware (req, res, next) {

  var urlLangCode = getUrlLangCode(req.url);
  var defaultLangCode = asimov.config('defaultLangCode');
  var supported = new locale.Locales(asimov.config('languages'));
  var accepted = new locale.Locales(req.headers['accept-language']);

  if (urlLangCode && urlLangCode === defaultLangCode) {

    var url = req.url.replace('/' + defaultLangCode, '');
    return res.redirect(url || '/');
  }
  else if (urlLangCode && ~req.url.indexOf('/' + urlLangCode + '/home')) {
    return res.redirect('/' + urlLangCode);
  }
  else if (!urlLangCode) {

    var bestMatch = accepted.best(supported);
    var bestLangCode = bestMatch && bestMatch.code;
    var newUrl = '/' + bestLangCode + req.url;

    if (bestLangCode !== defaultLangCode && pageExists(newUrl)) {

      return res.redirect(newUrl);
    }
  }

  next();
};
