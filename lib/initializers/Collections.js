var asimov = require('asimov');

var Initializer = require('./Initializer');
var PageNodesCollection = require('../nodes/PageNodesCollection');
var StyleSheetNodesCollection = require('../nodes/StyleSheetNodesCollection');
var ScriptNodesCollection = require('../nodes/ScriptNodesCollection');
var TemplatesCollection = require('../render/TemplatesCollection');
var SiteDataCollection = require('../core/SiteDataCollection');
var TemplateHelpersCollection = require('../render/TemplateHelpersCollection');
var _ = require('lodash');

var _super = Initializer.prototype;

module.exports = Initializer.extend({

  'run': function (next) {

    var self = this;
    var options = self.options;

    var constructors = {
      'styleSheets': StyleSheetNodesCollection,
      'scripts': ScriptNodesCollection,
      'templates': TemplatesCollection,
      'pages': PageNodesCollection,
      'siteData': SiteDataCollection,
      'helpers': TemplateHelpersCollection
    };

    asimov.collections = asimov.collections || {};

    _.each(constructors, function (constructor, name) {
      var collection = new constructor(null, options);
      options[name] = asimov.collections[name] = collection;
    });

    // This makes sure all page nodes, even in sub collections,
    // have access to the master collection with all pages
    self.mediator.publish('collection:pages', options.pages);

    self.options = options;
    next();
  }
});