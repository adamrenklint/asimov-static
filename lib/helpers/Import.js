var Helper = require('./Helper');
var _super = Helper.prototype;
var _ = require('lodash');

module.exports = Helper.extend({

  'findTemplate': function (name) {

    var self = this;
    if (!self._templates) self._templates = {};
    if (!self._templates[name]) {
      self._templates[name] = self.templates.find(function (t) {
        return t.attributes.name === name;
      });
    }

    return self._templates[name];
  },

  'run': function (name, data, params) {

    var self = this;
    params = _.extend({}, data.page, data, params);

    var template = self.findTemplate(name);

    self.assert('object', template, 'Failed to import partial template "' + name  + '" @ ' + self.currentUrl);

    return template.attributes.compiled(params);
  }
});
