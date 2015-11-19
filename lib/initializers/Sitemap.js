var Initializer = require('./Initializer');
var _ = require('lodash');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'generate': function () {

    if (process.env.USE_STATIC_PUBLIC) return;
    
    var self = this;
    var started = new Date();
    var protocol = self.options.protocol ? self.options.protocol : 'http:';
    var baseUrl = protocol + '//' + self.options.domain_name;
    var count = 0;
    var xml = '';

    xml += '<?xml version="1.0" encoding="utf-8"?>';
    xml += '<urlset ' +
              'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
              'xmlns:xhtml="http://www.w3.org/1999/xhtml"' +
              '>';

    self.options.pages.each(function (page) {

      if (!page.isHidden() && page.attributes.url !== '/') {

        count++;

        xml += '<url><loc>' + baseUrl + page.attributes.url + '</loc>';

        var modDate = new Date(page.attributes.modifiedAt);
        xml += '<lastmod>' + modDate.toISOString() + '</lastmod>';

        xml += self.alternates(page, baseUrl);

        var depth = page.attributes.url.split('/').length / 10;
        var priority = 0.5 - depth;
        if (priority < 0.1) priority = 0.1;

        xml += '<priority>' + priority + '</priority>';

        xml += '</url>';
      }
    });

    xml += '</urlset>';

    var path = self.options.outputPath + '/sitemap.xml';
    self.filesystem.writeFile(path, xml);

    self.logger.since('sitemap', 'Indexed ' + count + ' url(s)', started);
  },

  'alternates': function (page, baseUrl) {

    var self = this;
    var xml = '';
    var pageAttributes = page.attributes;
    var pageLangCode = pageAttributes.langCode;
    var path = pageAttributes.path;
    var nonLocalizedPath = path.replace('.' + pageLangCode + '.txt', '.txt');

    var url = pageAttributes.url.replace('/' + pageLangCode, '');
    if (url === '') url = '/';

    asimov.config('languages').forEach(function (code) {

      var codePath = nonLocalizedPath.replace('.txt', '.' + code + '.txt');
      var localizedExists = self.filesystem.pathExists(codePath);
      if (code === 'en') {
        xml += '<xhtml:link ' +
          'rel="alternate" ' +
          'hreflang="' + code + '" ' +
          'href="' + baseUrl + url + '"/>';
      }
      else if (localizedExists) {
        xml += '<xhtml:link ' +
          'rel="alternate" ' +
          'hreflang="' + code + '" ' +
          'href="' + baseUrl + '/' + code + url + '"/>';
      }
    });

    return xml;
  },

  'run': function (next) {

    var self = this;

    self.generate = _.debounce(self.generate, 1000);
    self.generate();

    self.bindTo(self.options.pages, 'add remove change:url', 'generate');

    next();
  }
});
