var FilesystemCollection = require('../core/FilesystemCollection');
var PageNode = require('./PageNode');
var _ = require('lodash');
var npath = require('path');
var handlebars = require('handlebars');
var marked = require('marked');

var _super = FilesystemCollection.prototype;

module.exports = FilesystemCollection.extend({

  'filetype': 'page',
  'extension': 'txt',

  'comparator': 'sortablePath',

  'model': PageNode,

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.aliasIndex = {};
    self.bindTo(self, 'add change:alias', 'indexAlias');
  },

  'indexAlias': function (model) {

    var self = this;
    var alias = model.attributes.alias;
    if (typeof alias === 'string') alias = [alias];

    alias && alias.forEach(function (url) {
      self.aliasIndex[url] = model.attributes.url;
    });
  },

  'defaultPages': function (urls) {

    var self = this;
    var count = 0;

    _.each(urls, function (url) {

      var page =  self.get(url);
      if (!page) {

        count++;

        var path = npath.join(self.options.frameworkDir, 'lib/pages' + url + '/error.txt');
        // self.logger.pending(self.namespace, 'Loading default 404 Not Found page @ ' + path);
        page = new self.model(null, self.options);

        page.fetch(path).done(function () {

          var models = _.flatten(_.toArray(arguments));
          self.add(models);
          asimov.queue.add(models);
        });
      }
    });

    return count;
  },

  'ensureErrorPages': function () {

    var self = this;
    var started = new Date();
    var defaultCount = self.defaultPages(['/404', '/error']);
    defaultCount && self.logger.since(self.namespace, 'Loaded ' + defaultCount + ' default page(s)', started);
  },

  'filter': function (test, options) {

    var self = this;
    options || (options = {});

    self.assert('function', test, 'Cannot filter collection without a function to test each models attributes with');

    var models = _super.filter.call(self, function (model) {

      if (!options.hidden && model.isHidden()) return false;

      return test(model);
    });

    options.comparator = options.sortBy || self.comparator;
    options = _.merge({}, self.options, options);

    options.offset = options.offset || 0;
    options.limit = options.limit || models.length;

    if (options.order === 'DESC' || options.reverse) {
      var comparator = options.comparator;
      options.comparator = function (a, b) {
        if (a.attributes[comparator] > b.attributes[comparator]) return -1;
        if (b.attributes[comparator] > a.attributes[comparator]) return 1;
        return 0;
      };
    }

    var collection = new self.constructor(models, options);

    if (options.offset || options.limit) {
      models = collection.models.slice(options.offset, options.offset + options.limit);
      collection.reset(models);
    }

    return collection;
  },

  'getUrlForAlias': function (url) {

    var self = this;
    return self.aliasIndex[url];
  },

  'childrenOf': function (parentUrl, options) {

    var self = this;
    options || (options = {});

    self.assert('defined string', parentUrl, 'Invalid parentUrl');

    var parent = self.get(parentUrl);
    self.assert('object', parent, 'No parent page exists with url ' + parentUrl);

    return self.filter(function (model) {

      var url = model.attributes.url;
      if (parentUrl == url) return false;

      var slashesInParentUrl = parentUrl.split('/').length - 1;
      if (parentUrl === '/') slashesInParentUrl = 0;
      var slashesInChildUrl = url.split('/').length - 1;

      if (slashesInChildUrl > (slashesInParentUrl + 1)) return false;

      return url.indexOf(parentUrl) === 0;
    }, options);
  },

  'renderValues': function (model) {

    var self = this;
    var options = self.options;
    var templates = options.templates;

    self.mediator.trigger('pre:render:page', model);

    var attributes = model.toJSON();
    var raw = attributes.raw;
    attributes.page = attributes;

    attributes.site = self.options.siteData.getJSON(attributes.langCode);
    attributes.pkg = self.options.pkg;

    if (attributes.inherits) {
      var _super = options.pages.get(attributes.inherits);
      attributes['super'] = _super.attributes;
    }
    attributes = self.mergeDefaultLangAttributes(attributes);

    function renderValues (value, key, collection) {

      if (key === 'page' || key === 'raw') return;

      if (typeof value === 'string') {

        var renderedTemplate = false;
        var renderedMarkdown = false;
        var containsMarkup = false;

        if (value.indexOf('{{') >= 0 && value.indexOf('}}') > 0) {

          var template = handlebars.compile(value);
          value = template(attributes);
          renderedTemplate = true;
        }

        if (value.indexOf('\n') >= 0) {

          value = self.markdown(value);
          value = self.clean(value);
          renderedMarkdown = true;
        }

        if (value.indexOf('<') >= 0 && value.indexOf('>') >= 0) {
          containsMarkup = true;
        }

        if (containsMarkup) {
          value = new handlebars.SafeString(value);
        }

        collection[key] = value;
      }
      else if (_.isPlainObject(value)) {
        _.each(value, renderValues);
      }
    }

    _.each(attributes, renderValues);
    attributes.raw = raw;
    model.set(attributes, { 'silent': true });
  },

  'markdown': function (raw) {

    var self = this;
    var processed = marked(raw).trim();

    // Remove wrapping <p> paragraphs
    var lastIndex = processed.length - 4;
    var startsWithParagraph = processed.indexOf('<p>') === 0;
    var endsWithParagraph = processed.indexOf('</p>') === lastIndex;

    if (startsWithParagraph && endsWithParagraph) {
      processed = processed.substr(0, lastIndex);
      processed = processed.substr(3);
    }

    if (processed === raw) {
      return raw;
    }

    return processed;
  },

  'clean': function (raw) {

    var self = this;

    raw = raw.replace(/[^>]\n[^<]/g, function (match) {
      return match.replace('\n', '<br>');
    });

    return raw;
  },

  'mergeDefaultLangAttributes': function (attributes) {
    var self = this;
    if (asimov.config('defaultLangFallback') && attributes.langCode !== asimov.config('defaultLangCode')) {
      var defaultLangUrl = '/' + attributes.url.split('/').slice(2).join('/');
      var defaultLangPage = self.get(defaultLangUrl);
      
      if (defaultLangPage) {
        var defaultAttributes = defaultLangPage.toJSON();
        var copiedAttributes = [];
        _.each(defaultAttributes, function (value, key) {
          if (typeof attributes[key] === 'undefined') {
            attributes[key] = defaultAttributes[key];
            copiedAttributes.push(key);
          }
        });

        if (copiedAttributes.length) {
          self.logger.pending(self.namespace, 'Using fallback values from ' + defaultLangUrl + ' for ' + copiedAttributes.join(', ') + ' @ ' + attributes.url, 'red');
        }
      }
    }
    return attributes;
  }
});