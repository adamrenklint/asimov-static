var DependencyParser = require('./DependencyParser');
var _  = require('lodash');
var _super = DependencyParser.prototype;

module.exports = DependencyParser.extend({

  'namespace': 'Parser',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.assert('array', self.options.paths && self.options.paths.styles, 'Cannot create StyleSheetParser without an array of paths to search for stylesheets');
  },

  'parse': function (model, raw, dependencies) {

    var self = this;
    var attributes = model.attributes;
    raw = self.assertAttributes(attributes, raw);
    var regExp = /(@import )("|')((\w|\/|\.)+)("|')/;

    var matches = raw.match(regExp);
    var match = matches && matches[0];

    if (match && typeof match === 'string') {

      var filename = match.replace(regExp, function (match, prefix, firstQuote, name, lastChar, lastQuote) {
        return name;
      });
      if (filename.indexOf('.styl') < 1) {
        filename += '.styl';
      }

      if (filename.indexOf('node_modules') < 0) {

        var path = self.filesystem.findFirstMatch(filename, self.options.paths.styles);

        if (!path) {
          throw new Error('StyleSheetParser could not locate dependency "' + filename + '"');
        }

        var file = self.filesystem.readFile(path);
        raw += file;

        self.add(model, path, dependencies);
      }

      raw = raw.replace(match, '');
      self.parse(model, raw, dependencies);
    }
    else {

      self.add(model, model.attributes.path, dependencies);
    }
  }
});