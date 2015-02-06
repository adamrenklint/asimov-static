var Base = require('../core/Base');
var stylus = require('stylus');
var nib = require('nib');
var _ = require('lodash');
var npath = require('path');
var _super = Base.prototype;

module.exports = Base.extend({

  'namespace': 'Render',

  'run': function (model) {

    var self = this;
    var deferred = self.deferred();

    self.mediator.trigger('pre:render:stylesheet', model);

    var attributes = model.attributes;
    var path = attributes.path;

    if (!self.filesystem.pathExists(path)) {

      throw new Error('Cannot find stylesheet @ ' + path);
    }

    var raw = self.filesystem.readFile(path).toString();

    function done (result) {

      model.set({
        'raw': raw,
        'rendered': result
      }, {
        'silent': true
      });

      self.mediator.trigger('post:render:stylesheet', model);
      model.trigger('change:rendered', model);

      deferred.resolve(model);
    }

    if (!model.attributes.compile) {
      done(raw);
    }
    else {

      try {

        stylus(raw, {
          'compress': true,
          'paths': self.options.paths.styles.slice(0),
        })
        .use(nib())
        .import('nib')
        .render(function (err, result) {
          if (err) {
            throw new Error('Failed to render stylesheet @ ' + path + '\n' + err);
          }
          done(result);
        });
      }
      catch (e) {

        throw new Error('Failed to compile stylesheet @ ' + path + '\n' + e);
      }
    }

    return deferred;
  }
});
