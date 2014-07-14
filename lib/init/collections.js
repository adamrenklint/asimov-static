var asimov = require('asimov');

module.exports = function (next) {

  [
    'Pages',
    'StyleSheets',
    'Scripts',
    'Templates',
    'Helpers',
    'SiteData'
  ].forEach(function (className) {

    var constructor = require('../collections/' + className);
    var name = className[0].toLowerCase() + className.substr(1);
    asimov.register(name, new constructor(), 'pages');
  });

  next();
};
