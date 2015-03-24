var Collection = require('../core/Collection');
var RenderJob = require('./RenderJob');
var _ = require('lodash');
var _super = Collection.prototype;
var asimov = require('asimov');

module.exports = Collection.extend({

  // 'namespace': 'queue',

  'renderCosts': {
    'page': 5,
    'styleSheet': 20,
    'script': 30
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.limit = 100;
    self.delay = 10;
    self.pending = [];

    self.renderer = new RenderJob(self.options);

    self.bindTo(self.mediator, 'queue:start', self.start);

    asimov.shutdown(function (next) {
      self.stopping = true;
      self.stop();
      next();
    });
  },

  'start': function () {

    var self = this;
    if (!self.started) {

      self.started = true;

      self.render();
    }
  },

  'stop': function () {

    var self = this;

    if (self.loopTimeout) {
      clearTimeout(self.loopTimeout);
    }
  },

  'getNextBatch': function () {

    var self = this;
    var limit = self.limit;
    var models = [];
    var index = 0;
    var model, type, cost, firstType;

    while (limit) {

      model = self.models[index];
      index++;

      if (model) {

        type = model.attributes.type;
        firstType = firstType || type;

        cost = self.renderCosts[type] || 1;
        cost = cost > self.limit ? self.limit : cost;

        if (cost <= limit && type === firstType) {
          models.push(model);
          limit = limit - cost;
        }
      }
      else {
        limit = 0;
      }
    }

    self.remove(models);

    return models;
  },

  'render': function () {

    var self = this;
    var started = new Date();

    if (self.stopping) return false;

    var models = self.getNextBatch();
    var size = models.length;
    var promises = [];

    if (!size) {

      self.loopTimeout = _.delay(self.render, 1000);
      return;
    }

    var job, attributes;

    while (size--) {

      job = models.shift();
      attributes = job.attributes;

      if (self.stopping) return false;

      self.logger.low(self.namespace, 'Rendering ' + attributes.type + ' @ ' + attributes.url);
      job.started = new Date();

      self.pending.push(job.id);
      job.done = self.renderer.run(job);
      job.done.done(function () {
        self.pending = _.without(self.pending, arguments[0].id);
        self.logger.lowSince(self.namespace, 'Rendered ' + attributes.type + ' @ ' + attributes.url, job.started);
      });

      promises.push(job.done);
    }

    self.when.call(self, promises).done(function () {

      if (self.stopping) return false;
      var models = _.flatten(_.toArray(arguments));
      _.each(models, function (model) {
        self.trigger('processed', model);
      });

      var groups = _.sortBy(models, function (model) {
        return model.attributes.type;
      });

      var logString = 'Processed ' + models.length + ' ' + models[0].attributes.type + '(s)';
      self.logger.since(self.namespace, logString, started);

      if (!self.models.length && !self.pending.length) {
        self.mediator.trigger('queue:empty');
      }
      self._scheduleNext();
    }).fail(function () {

      if (self.stopping) return false;
      throw new Error('Failed to complete ' + job.attributes.type + ' render batch');
      self._scheduleNext();
    });
  },

  '_scheduleNext': function () {
    var self = this;
    self.loopTimeout = _.delay(self.render, self.delay);
  },

  'prio': function (url, callback) {

    var self = this;
    self.logger.low(self.namespace, 'Processing priority job in queue @ ' + url);

    var job = self.get(url);
    job.started = new Date();

    self.remove(job);

    self.renderer.run(job).done(function () {
      var models = _.flatten(_.toArray(arguments));
      _.each(models, function (model) {
        self.trigger('processed', model);
      });
      self.logger.lowSince(self.namespace, 'Rendered ' + job.attributes.type + ' @ ' + url, job.started);
      callback();
    });
  }
});
