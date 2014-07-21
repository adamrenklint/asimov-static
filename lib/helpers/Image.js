var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');
var fs = require('fs');

module.exports = Helper.extend({

  'run': function (src, params) {

    var self = this;

    if (typeof src !== 'string') {
      params = src;
      src = params.src;
    }

    params.src = typeof src === 'string' ? src : params.src;

    self.assert('string', params.src, 'Invalid source url');

    var currentUrl = self.currentUrl;

    console.log('render', currentUrl)

    if (self.currentPage.attributes.langCode !== self.options.localization.defaultLangCode) {

      // load from the non-localized url path
      currentUrl = currentUrl.replace('/' + self.currentPage.attributes.langCode, '');

      // if a "localized" image exists, use it instead
      var parts = src.split('.');
      parts.splice(parts.length - 1, 0, self.currentPage.attributes.langCode);
      var filename = parts.join('.');
      var filepath = self.currentPage.attributes.folderPath + '/' + filename;

      if (fs.existsSync(filepath)) {
        params.src = filename;
      }
    }

    if (params.src.indexOf('site') === 0) {
      params.src = '/' + params.src;
    }
    else {
      params.src = currentUrl === '/' ? currentUrl + params.src : currentUrl + '/' + params.src;
    }

    delete params.page;

    return self.html('img', params);
  }
});
