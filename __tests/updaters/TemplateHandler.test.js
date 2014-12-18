var libPath = '../../lib/';
var TemplateHandler = require(libPath + 'updaters/TemplateHandler');
var Collection = require(libPath + 'core/Collection');
var Test = require(libPath + 'runner/Test');
var _ = require('lodash');

Test.run('updaters/TemplateHandler', function (test) {

  var instance;

  test.beforeEach(function () {
    instance = new TemplateHandler({
      'pages': new Collection(),
      'templates': new Collection(),
      'styleSheets': new Collection()
    });
  });

  test.afterEach(function () {
    instance.destroy();
  });

  test.spec('created (string path, array graph)', function () {

    test.it('should call fetch() on self.options.templates', function () {

      var spy = sinon.spy(instance.options.templates, 'fetch');

      instance.created('/any/path/template.tmpl', []);

      expect(spy).to.have.been.calledOnce;
      instance.options.templates.fetch.restore();
    });
  });

  test.spec('modified (string path, array graph)', function () {

    test.when('graph contains a page', function () {

      test.it('should defer trigger "change:raw" on page', function (done) {

        var notModified = instance.options.pages.create({
            'path': '/foo/bar2/page.txt'
          });

        instance.modified('/barabaz/something.tmpl', [notModified]);

        notModified.on('change:raw', function () {
          done();
        });
      });
    });

    test.when('graph contains a template', function () {

      test.when('template matches the modified path', function () {

        test.it('should call fetch() on the modified template', function () {

          var modified = new instance.options.templates.model({
            'path': '/barabaz/something.tmpl'
          });
          var spy = sinon.spy(modified, 'fetch');

          instance.modified('/barabaz/something.tmpl', [modified]);

          expect(spy).to.have.been.calledOnce;
          modified.fetch.restore();
        });
      });

      test.when('template doesn\'t match the modified path', function () {

        test.it('should defer trigger "force:change" on the template', function (done) {

          var notModified = instance.options.templates.create({
            'path': '/merabaz/another.tmpl'
          });

          instance.modified('/barabaz/something.tmpl', [notModified]);

          notModified.on('force:change', function () {
            done();
          });
        });
      });
    });
  });

  test.spec('deleted (string path, array graph)', function () {

    test.when('graph contains a page', function () {

      test.it('should defer trigger "change:raw" with page', function (done) {

        var notDeleted = instance.options.pages.create({
            'path': '/foo/bar2/page.txt'
          });

        instance.deleted('/barabaz/something.tmpl', [notDeleted]);

        notDeleted.on('change:raw', function () {
          done();
        });
      });
    });

    test.when('graph contains a template', function () {

      test.when('template matches the deleted path', function () {

        test.it('should call destroy() on the deleted template', function () {

          var deleted = new instance.options.templates.model({
            'path': '/barabaz/something.tmpl'
          });
          var spy = sinon.spy(deleted, 'destroy');

          instance.deleted('/barabaz/something.tmpl', [deleted]);

          expect(spy).to.have.been.calledOnce;
          deleted.destroy.restore();
        });
      });

      test.when('template doesn\'t match the deleted path', function () {

        test.it('should defer trigger "force:change" on the template', function (done) {

          var notDeleted = instance.options.templates.create({
            'path': '/merabaz/another.tmpl'
          });

          instance.deleted('/barabaz/something.tmpl', [notDeleted]);

          notDeleted.on('force:change', function () {
            done();
          });
        });
      });
    });
  });
});