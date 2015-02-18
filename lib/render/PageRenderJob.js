var Base = require('../core/Base');
var _ = require('lodash');
var _super = Base.prototype;

module.exports = Base.extend({

  'namespace': 'Render',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);
  },

  'run': function (model) {

    var self = this;
    var deferred = self.deferred();
    var options = self.options;
    var templates = options.templates;

    var attributes = model.toJSON();
    var template = templates.get(attributes.template);

    if (!template) {
      throw new Error('Failed to render ' + attributes.path + ' - missing template "' + attributes.template + '"');
    }

    var tmpl = template.attributes.compiled;
    attributes.rendered = tmpl(attributes).replace(/\s\s/g, ' ');
    model.set(attributes, { 'silent': true });

    self.mediator.trigger('post:render:page', model);
    model.trigger('change:rendered', model);

    deferred.resolve(model);

    return deferred;
  }
});
