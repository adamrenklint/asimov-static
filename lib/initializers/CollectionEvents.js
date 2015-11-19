var Initializer = require('./Initializer');
var Watcher = require('../watcher/Watcher');
var Queue = require('../render/Queue');
var OutputWriter = require('../render/OutputWriter');
var _ = require('lodash');
var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    var watcher = asimov.watcher = new Watcher(null, options);
    var queue = asimov.queue = new Queue(null, options);
    var output = asimov.writer = new OutputWriter(options);

    var collections = [
      options.pages,
      options.styleSheets,
      options.scripts
    ];

    self.bindTo(options.pages, 'add change:raw forced:change', options.pages.renderValues);

    _.each(collections, function (collection) {

      var changeHandler = process.env.ENV === 'development' && !process.env.PREBUILD_STATIC_PUBLIC ? collection.markDirty : queue.add;
      self.bindTo(collection, 'add change:raw forced:change', changeHandler);

      self.bindTo(collection, 'change:rendered', output.write);
      self.bindTo(collection, 'change:rendered', watcher.watch);
      self.bindTo(collection, 'remove', output.clear);
    });

    self.bindTo(options.templates, 'add change:raw', watcher.watch);

    self.options = options;
    next();
  }
});
