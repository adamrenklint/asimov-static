var Base = require('../core/Base');
var _super = Base.prototype;
var npath = require('path');
var _ = require('lodash');
var wrench = require('wrench');
var fs = require('fs');

module.exports = Base.extend({

  'namespace': 'queue',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.filesystem.forceExists(self.options.outputPath);

    self.symlinkSiteFolder('images');
    self.symlinkSiteFolder('fonts');
    self.symlinkSiteFolder('files');
  },

  'symlinkSiteFolder': function (name) {

    var self = this;
    var srcPath = process.cwd() + '/site/' + name;
    var destFolder = self.options.outputPath + '/site';
    var destPath = destFolder + '/' + name;

    if (self.filesystem.pathExists(srcPath)) {
      self.filesystem.forceExists(destFolder);

      if (process.env.PREBUILD_STATIC_PUBLIC) {
        wrench.copyDirSyncRecursive(srcPath, destPath);
      }
      else {
        self.filesystem.symlink(srcPath, destPath, 'dir');
      }
    }
  },

  'symlinkPageFolder': function (srcPath, destPath) {

    var self = this;

    self.filesystem.readDirectory(srcPath, function (subpath, filename) {

      if (self.filesystem.isDirectory(subpath)) {
        filename = filename.replace(/(\d)+-/, '');
        self.symlinkPageFolder(subpath, destPath + filename + '/');
      }
      else if (!self.filesystem.hasFileExtension(filename, 'txt')) {
        self.filesystem.forceExists(destPath);

        if (process.env.PREBUILD_STATIC_PUBLIC) {
          fs.writeFileSync(npath.join(destPath, filename), fs.readFileSync(subpath));
        }
        else {
          self.filesystem.symlink(subpath, npath.join(destPath, filename), 'dir');
        }
      }
    });
  },

  'write': function (model) {

    var self = this;
    var started = new Date();
    var attributes = model.attributes;
    var path = model.getOutputPath();
    var output = attributes.rendered;

    var parts = path.split('/');
    parts.pop();
    var parentPath = parts.join('/');
    self.filesystem.forceExists(parentPath);

    if (model.isPage()) {

      var url = model.attributes.url;
      self.symlinkPageFolder(self.options.paths.content + url, (self.options.outputPath + url).replace('//', '/'));
      output = output.replace('<head>', '<head><meta generator="asimov.js">');
      output = output.replace(/%divider%/g, '---').replace(/%cl%/g, '{{').replace(/%cr%/g, '}}');
    }

    self.filesystem.writeFile(path, output);
    model.set({ 'outputPath': path, 'dirty': false }, { 'silent': true });
    self.logger.lowSince(self.namespace, 'Saved ' + attributes.type + ' to build folder @ ' + path, started);
  },

  'clear': function (model) {

    var self = this;
    var attributes = model.attributes;
    var path = model.getOutputPath();

    self.logger.low(self.namespace, 'Clearing ' + attributes.type + ' from static build folder @ ' + path);

    self.filesystem.recursiveDelete(path);
  }
});
