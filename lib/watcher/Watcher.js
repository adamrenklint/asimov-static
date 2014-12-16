var Model = require('../core/Model');
var _ = require('lodash');
var Filesystem = require('../core/Filesystem');

var StyleSheetParser = require('../parsers/StyleSheetParser');
var ScriptParser = require('../parsers/ScriptParser');
var PageParser = require('../parsers/PageParser');
var TemplateParser = require('../parsers/TemplateParser');

var PageHandler = require('../updaters/PageHandler');
var TemplateHandler = require('../updaters/TemplateHandler');
var StyleSheetHandler = require('../updaters/StyleSheetHandler');
var SiteDataHandler = require('../updaters/SiteDataHandler');
var ScriptHandler = require('../updaters/ScriptHandler');

var asimov = require('asimov');

var _super = Model.prototype;

module.exports = Model.extend({

  'namespace': 'watcher',

  'parsers': {

    'styleSheet': StyleSheetParser,
    'page': PageParser,
    'template': TemplateParser,
    'script': ScriptParser
  },

  'handlers': {

    'styleSheet': StyleSheetHandler,
    'page': PageHandler,
    'template': TemplateHandler,
    'script': ScriptHandler,
    'siteData': SiteDataHandler
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.filesystem = new Filesystem();

    self.implement('parsers');
    self.implement('handlers');

    asimov.shutdown(function (next) {
      self.stopping = true;
      next();
    });
  },

  'implement': function (type) {

    var self = this;
    var hiddenType = '_' + type;

    self[hiddenType] = {};
    _.each(self[type], function (Ctor, name) {
      self[hiddenType][name] = new Ctor(_.merge({}, self.options, {
        'watcher': self
      }));
    });
  },

  'watch': function (model) {

    var self = this;
    var attributes = model.attributes;

    self.assert('string', attributes.path, 'Cannot watch model without string as path');
    self.assert('string', attributes.type, 'Cannot watch model without string as type @ ' + attributes.path);
    self.assert('string', attributes.raw, 'Cannot watch model without string as raw @ ' + attributes.path);

    self.startWatching(process.cwd());
    self.parseDependencies(model);
  },

  'startWatching': function (path) {

    var self = this;

    if (process.env.ENV === 'production' && !process.env.WATCH) self.watching = true;

    if (!self.watching) {

      self.watching = self.filesystem.watchTree(path, self.handleChange);

      asimov.shutdown(function (next) {

        self.watching();
        self.watching = null;

        next();
      });
    }
  },

  'destroy': function (argument) {

    var self = this;

    self.watching && self.watching();
    _super.destroy.apply(self, arguments);
  },

  'forceChange': function (models) {

    var self = this;
    _.each(models, self.handleChange);
  },

  'getPathType': function (path) {

    var self = this;

    _.each(self.options.paths.initializers, function (initializersPath) {
      if (path.indexOf(initializersPath) === 0) {
        self.logger.pending(self.namespace, 'Initializer was invalidated, restarting process');
        self.restart(path);
      }
    });

    _.each(self.options.paths.middleware, function (middlewarePath) {
      if (path.indexOf(middlewarePath) === 0) {
        self.logger.pending(self.namespace, 'Middleware was invalidated, restarting process');
        console.log(self.restart, 'where the hell is this method coming from?');
        self.restart(path);
      }
    });

    if (path.indexOf(process.cwd() + '/environments') === 0) {
      self.logger.pending(self.namespace, 'Configuration was invalidated, restarting process');
      self.restart(path);
    }

    if (path.indexOf(process.cwd() + '/site/data/') >= 0) {
      return 'siteData';
    }
    else if (self.filesystem.hasFileExtension(path, 'txt')) {
      return 'page';
    }
    else if (self.filesystem.hasFileExtension(path, 'tmpl')) {
      return 'template';
    }
    else if (self.filesystem.hasFileExtension(path, 'styl')) {
      return 'styleSheet';
    }
    else if (self.filesystem.hasFileExtension(path.replace('asimov.js', 'asimov'), 'js')) {
      return 'script';
    }
  },

  'handleChange': function (path, before, after, type) {

    var self = this;
    if (self.stopped) return false;
    if (path.indexOf(self.options.outputPath) >= 0) return;

    type = type || 'invalidated';
    var graph = self.get(path) || [];
    var pathType = self.getPathType(path);
    var handler = self._handlers[pathType];

    _.defer(function () {

      if (self.stopped) return false;
      handler && _.keys(after).length > 0 && self.logger.pending(self.namespace, 'A ' + pathType + ' file was ' + type + ', invalidating ' + graph.length + ' dependencies @ ' + path);

      type = type === 'invalidated' ? 'modified' : type;
      handler && handler[type](path, graph);
    });
  },

  'parseDependencies': function (model) {

    var self = this;
    var started = new Date();
    var attributes = model.attributes;
    var type = attributes.type;
    var parser = self._parsers[type];

    if (self.stopped) return false;

    if (parser) {

      var result = parser.parse(model, null, self);
      self.ensureForceChangeBindings();

      self.logger.lowSince(self.namespace, 'Parsed dependencies @ ' + model.attributes.path, started);

      return result;
    }
    else {
      throw new Error('No dependency parser exists for type "' + type + '"');
    }
  },

  'ensureForceChangeBindings': function () {

    var self = this;

    _.each(self.attributes, function (models, path) {
      _.each(models, function (model) {
        if (!model.forceChangeBinding) {
          model.forceChangeBinding = model.bindTo(model, 'force:change', self.forceChange);
        }
      });
    });
  }
});
