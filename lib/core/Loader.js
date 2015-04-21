var Base = require('./Base');
var Config = require('./Config');
var _ = require('lodash');
var npath = require('path');
var asimov = require('asimov');

var _super = Base.prototype;

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.started = new Date();

    self.logger.pending(self.namespace, 'Running in ' + process.env.ENV.toUpperCase() + ' mode');
    var config = self.config = new Config(self.options);
    config.json.outputPath = config.json.paths.outputDir;
    _.merge(self.options, config.json, {
      'pkg': require(npath.join(process.cwd(), 'package.json'))
    });

    asimov.shutdown(function (next) {
      self.stopping = true;
      next();
    });
  },

  'start': function (callback) {

    var self = this;

    self.logger.muteLog = process.env.MUTE;
    self.logger.baseDir = process.cwd();
    self.logger.frameworkDir = self.options.frameworkDir;

    _.defer(function () {
      self.bootstrap().done(callback);
    });
  },

  'getExports': function () {

    var self = this;
    var exportPaths = self.options.exportScripts;
    var exports = {};

    exportPaths.forEach(function (name) {
      var path = self.filesystem.findFirstMatch('/' + name + '.js', self.options.paths.scripts);
      exports[name.split('/').pop()] = require(path);
    });

    return exports;
  },

  'getAllScripts': function (type, paths) {

    var self = this;
    var scripts = [];
    var source = self.config.json[type];

    if (!_.isArray(source)) {
      source = [source];
    }

    _.each(source, function (name) {

      var path = self.filesystem.findFirstMatch(name + '.js', paths);
      path && scripts.push(path);
    });

    return scripts;
  },

  'runSequential': function (namespace, paths) {

    var self = this;
    var type = namespace + 's';
    paths = paths[type];
    var deferred = self.deferred();
    var scripts = self.getAllScripts(type, paths);
    var count = scripts.length;

    function next () {

      if (asimov.config('state') === 'stopping') return false;

      if (!scripts.length) {

        return deferred.resolve(count);
      }

      var script = scripts.shift();

      _.defer(function () {

        if (self.stopped) return false;

        self.logger.low('init', 'Running ' + namespace + ' @ '+ script);

        var Constructor = require(script.replace(/\.js$/, ''));
        var instance = new Constructor(self.options);
        instance.run(next);
      });
    }

    next();

    return deferred.promise();
  },

  'bootstrap': function () {

    var self = this;
    var meta = self.options.meta;
    var deferred = self.deferred();

    self.runSequential('initializer', self.options.paths).done(function (count) {

      self.bindOnceTo(self.mediator, 'queue:empty', function () {
        asimov.config('server.ready', true);
        if (process.env.ENV === 'prebuild') {
          self.logger.since(self.namespace, 'Project prebuild complete', self.started);
          process.send && process.send({
            'terminate': true
          });
        }
      });

      var data = {
        'init': self.started,
        'done': (new Date()).valueOf()
      };

      self.mediator.publish('app:started', data);
      process.send && process.send(data);

      deferred.resolve();

      self.mediator.trigger('queue:start');
    });

    return deferred.promise();
  }
});
