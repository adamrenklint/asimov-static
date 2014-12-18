var libPath = '../../lib/';
var PageParser = require(libPath + 'parsers/PageParser');
var TemplatesCollection = require(libPath + 'render/TemplatesCollection');
var PageNodesCollection = require(libPath + 'nodes/PageNodesCollection');
var Model = require(libPath + 'core/Model');
var _ = require('lodash');

var Test = require(libPath + 'runner/Test');

Test.run('parsers/PageParser', function (test) {

  function options (opts) {
    opts = opts || {};
    opts.muteLog = true;
    opts.localization = {
      'defaultLangCode': 'en'
    };
    opts.paths = {
      'content': 'tests/mocks/pages',
      'frameworkPages': 'tests/mocks/pages'
    };
    return opts;
  }

  var instance, pages, templates;

  test.before(function (done) {

    templates = new TemplatesCollection(null, options());
    pages = new PageNodesCollection(null, options());

    var loadedTemplates = templates.fetch('tests/mocks/templates');
    var loadedPages = pages.fetch('tests/mocks/pages');

    templates.when(loadedPages, loadedTemplates).done(function () {
      done();
    });
  });

  test.beforeEach(function () {
    instance = new PageParser(options({
      'templates': templates,
      'pages': pages
    }));
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('initialize (object options)', function () {

    test.when('options.templates is not a collection', function () {

      test.itShould.throwError(function () {
        new PageParser();
      });
    });
  });

  test.spec('parse (object model, string raw, object dependencies)', function () {

    test.when('model.attributes.template references a non-existing template', function () {

      test.itShould.throwError(function () {

        var model = new Model({
          'path': 'foo/bar',
          'raw': 'foo',
          'template': 'monkeybusiness'
        });
        var dependencies = new Model();
        instance.parse(model, null, dependencies);
      });
    });

    test.when('model.attributes.template references an existing template', function () {

      test.it('should register model as a dependency of itself', function () {

        var pagePath = 'foo/bar';
        var model = new Model({
          'path': pagePath,
          'raw': 'foo',
          'template': 'simple'
        });
        var dependencies = new Model();
        instance.parse(model, null, dependencies);

        var wasFound = false;

        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf(pagePath) >= 0) {
            _.each(arr, function (dep) {
              if (dep.attributes.path.indexOf(pagePath) >= 0) {
                wasFound = true;
              }
            });
          }
        });

        expect(wasFound).to.be.true;
      });

      test.it('should register model as a dependency of the template', function () {

        var pagePath = '01-foo/01-bar';
        var model = new Model({
          'path': pagePath,
          'raw': 'foo',
          'template': 'simple'
        });
        var dependencies = new Model();
        instance.parse(model, null, dependencies);

        var wasFound = false;

        _.each(dependencies.attributes, function (arr, path) {
          if (path.indexOf('simple') >= 0) {
            _.each(arr, function (dep) {
              if (dep.attributes.path.indexOf(pagePath) >= 0) {
                wasFound = true;
              }
            });
          }
        });

        expect(wasFound).to.be.true;
      });

      test.when('the template includes a partial', function () {

        test.it('should not register model as a dependency of the partial', function () {

          var pagePath = 'foo/bar';
          var model = new Model({
            'path': pagePath,
            'raw': 'foo',
            'template': 'includer'
          });
          var dependencies = new Model();
          instance.parse(model, null, dependencies);

          var wasFound = false;

          _.each(dependencies.attributes, function (arr, path) {
            if (path.indexOf('simple') >= 0) {
              wasFound = true;
            }
          });

          expect(wasFound).to.be.false;
        });
      });

      test.when('a model attribute value includes a partial', function () {

        test.it('should register model as a dependency of the partial', function () {

          var pagePath = 'foo/bar';
          var model = new Model({
            'path': pagePath,
            'raw': 'foo',
            'foo': 'foo {{import "includer"}} bar',
            'template': 'simple'
          });
          var dependencies = new Model();
          instance.parse(model, null, dependencies);

          var wasFound = false;

          _.each(dependencies.attributes, function (arr, path) {
            if (path.indexOf('includer') >= 0) {
              wasFound = true;
            }
          });

          expect(wasFound).to.be.true;
        });
      });

      test.when('a model attribute value uses the site variable', function () {

        test.it('should register model as a dependency for all loaded config files');
      });

      test.when('model inherits from another page', function () {

        test.it('should register model as a dependency of the other page', function () {

          var pagePath = '10-barbaz';
          var superUrl = '/foo';
          var model = new Model({
            'path': pagePath,
            'raw': 'foo',
            'inherits': superUrl,
            'template': 'simple'
          });
          var dependencies = new Model();
          instance.parse(model, null, dependencies);

          var wasFound = false;

          _.each(dependencies.attributes, function (arr, path) {
            if (path.indexOf('/mocks/pages/01-foo/simple.txt') >= 0) {
              wasFound = true;
            }
          });

          expect(wasFound).to.be.true;
        });
      });
    });
  });
});