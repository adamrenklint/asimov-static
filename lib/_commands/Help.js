var Command = require('./Command');
var _super = Command.prototype;
var _ = require('lodash');
var colors = require('colors');

module.exports = Command.extend({

  'prefix': 'ajs ',

  'commands': {

    'help': 'Show usage instructions',
    'create [name]': 'Create new project',
    'new page [url] [template]': 'Create a new page in /content',
    'new template [name]': 'Create a new template in /site/templates',
    'new style [name]': 'Create a new stylesheet in /site/styles',
    'extend [parent] [path]': 'Create subclass of [parent] in [path]',
    'start': 'Start project in current directory',
    'debug': 'Start project with verbose logging',
    'test [grep]': 'Run all tests in /tests, or only the ones matching [grep]',
    'coverage': 'Generate a test coverage report with Istanbul',
    'complexity': 'Generate a code complexity report with Plato',
    'publish': 'Publish project to NPM and push git tag'
  },

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.logAsimovHeader();

    console.log(self.lineDelimiter);
    // console.log(('   asimov.js ' + self.options.pkg.version + ' CLI').bold);
    console.log('   Usage:\n\n');

    _.each(self.commands, function (instruction, command) {
      console.log(self.padding + (self.prefix.replace('$', '$'.grey) + command).inverse);
      console.log(self.padding + instruction + '\n');

    });

    console.log(self.lineDelimiter);
  }
});