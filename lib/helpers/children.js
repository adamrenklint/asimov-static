var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'run': function (url, params, block) {

    var self = this;
    var children = [];
    var langCode = 'en';

    if (typeof url !== 'string') {
      block = params;
      params = url;
      url = params.url || self.currentUrl;
    }

    self.assert('function', block, 'Inner template block must be a function');

    var page = self.pages.get(url);
    self.assert('object', page, 'No page found for url ' + url);

    return page.children(params).map(function (child) {

      // if a localized version of the child exists, use that instead
      if (page.attributes.langCode !== self.currentPage.attributes.langCode) {
        var localizedUrl = '/' + self.currentPage.attributes.langCode;
        if (child.attributes.url !== '/') localizedUrl += child.attributes.url;
        child = self.pages.get(localizedUrl) || child;
      }

      self.registerDependency(page, child);
      return block(child.attributes);
    }).join('');
  }
});
